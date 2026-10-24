"""Reproducible original Sere instrumental. No samples or third-party melodies.
Requires numpy; creates a temporary WAV, then uses ffmpeg for browser delivery.
Run from repository root: python scripts/create-lagoon.py
"""
import pathlib, subprocess, tempfile, wave
import numpy as np

RATE = 24000
BEAT = 60 / 88
DURATION = 32 * BEAT
rng = np.random.default_rng(2401026)
audio = np.zeros((int((DURATION + 2) * RATE), 2))

def tone(midi, start, length, gain, pan=0, bell=False):
    t = np.arange(int(length * RATE)) / RATE
    hz = 440 * 2 ** ((midi - 69) / 12)
    env = np.minimum(t / .025, 1) * np.minimum((length - t) / .2, 1)
    if bell:
        env *= np.exp(-t * 2.7)
    signal = (np.sin(2*np.pi*hz*t) + .18*np.sin(2*np.pi*hz*2*t)) * env * gain
    i = int(start * RATE)
    audio[i:i+len(t), 0] += signal * (1-pan*.45)
    audio[i:i+len(t), 1] += signal * (1+pan*.45)

# Newly sequenced Cmaj7–Am7–Fmaj7–G6 miniature; no existing recording sampled.
chords = [(48,55,59,64), (45,52,55,60), (41,48,52,57), (43,50,55,59)]
melody = [76,79,74,71, 72,76,79,74, 69,72,76,72, 71,74,79,76]
for bar in range(8):
    chord = chords[bar % 4]
    for j, note in enumerate(chord):
        tone(note+12, bar*4*BEAT, 4*BEAT, .025, (j-1.5)/2)
    for b in range(4):
        tone(chord[0], (bar*4+b)*BEAT, BEAT*.75, .065)
        if b % 2 == 0:
            t = np.arange(int(.15*RATE))/RATE
            kick = np.sin(2*np.pi*(48*t+9*(1-np.exp(-25*t))))*np.exp(-t*28)*.12
            i = int((bar*4+b)*BEAT*RATE)
            audio[i:i+len(t)] += kick[:,None]
        for half in range(2):
            noise = rng.normal(0,.012,int(.06*RATE))*np.exp(-np.arange(int(.06*RATE))/RATE*80)
            i = int((bar*4+b+half*.5)*BEAT*RATE)
            audio[i:i+len(noise)] += noise[:,None]
    for j in range(2):
        tone(melody[bar*2+j], (bar*4+j*1.5+.5)*BEAT, 1.6, .085, -.3 if j else .3, True)

fade = np.minimum(np.arange(len(audio))/RATE/1.5,1) * np.minimum((len(audio)-np.arange(len(audio)))/RATE/2.5,1)
audio *= fade[:,None]
pcm = np.clip(audio*1.8,-.95,.95)
out = pathlib.Path('assets/lagoon-01.mp3')
with tempfile.TemporaryDirectory() as tmp:
    wav = pathlib.Path(tmp)/'lagoon.wav'
    with wave.open(str(wav),'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(RATE)
        f.writeframes((pcm*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-b:a','96k','-map_metadata','-1',str(out)],check=True)
print(f'{out}: {len(audio)/RATE:.2f}s, {out.stat().st_size} bytes')
