export const secondsLabel = value => {
  const ticks = Math.round(Math.max(0, Number(value) || 0) * 100);
  return `${Math.floor(ticks / 6000)}:${((ticks % 6000) / 100).toFixed(2).padStart(5, '0')}`;
};
export function parseTime(value) {
  const parts = String(value).trim().replace(',', '.').split(':').map(Number);
  if (!parts.length || parts.some(n => !Number.isFinite(n) || n < 0)) return NaN;
  return parts.reduce((total, n) => total * 60 + n, 0);
}
export function parseLyrics(text, duration = 180) {
  duration = Number.isFinite(duration) && duration > 0 ? duration : 180;
  const lines = String(text).replace(/^\uFEFF/, '').replace(/\r/g, '').split('\n');
  const cues = [];
  // SubRip and WebVTT retain their supplied start AND end times.
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes('-->')) continue;
    const [a, b] = lines[i].split('-->');
    const start = parseTime(a.trim()), end = parseTime(b.trim().split(/\s/)[0]);
    const words = [];
    while (++i < lines.length && lines[i].trim()) words.push(lines[i].replace(/<[^>]*>/g, ''));
    if (Number.isFinite(start) && end > start && words.length) cues.push({ start, end, text: words.join('\n') });
  }
  if (cues.length) return { cues: cues.sort((a,b) => a.start - b.start), timed: true };
  let offset = 0;
  const offsetMatch = String(text).match(/\[offset:([+-]?\d+)\]/i);
  if (offsetMatch) offset = Number(offsetMatch[1]) / 1000;
  for (const line of lines) {
    const tags = [...line.matchAll(/\[(\d{1,3}):([0-5]?\d(?:\.\d+)?)\]/g)];
    const words = line.replace(/\[[^\]]*\]/g, '').trim();
    for (const tag of tags) if (words) cues.push({ start: Math.max(0, +tag[1]*60 + +tag[2] + offset), text: words });
  }
  if (cues.length) {
    cues.sort((a,b) => a.start - b.start);
    return { cues: cues.map((cue,i) => ({...cue,end: cues[i+1]?.start ?? Math.max(duration, cue.start + 3)})), timed: true, openEnded: true };
  }
  const plain = lines.map(l => l.trim()).filter(l => l && !/^\[\w+:.+\]$/.test(l));
  return { cues: distribute(plain, duration), timed: false };
}
export function distribute(lines, duration) {
  if (!lines.length) return [];
  const total = Math.max(0.1, Number(duration) || 180);
  // A starting draft only; users can replace every boundary by tapping or editing.
  const weights = lines.map(line => Math.max(8, String(line).length));
  const sum = weights.reduce((a,b) => a+b, 0);
  let at = 0;
  return lines.map((text, i) => {
    const start = at; at += total * weights[i] / sum;
    return {start, end: i === lines.length-1 ? total : at, text: String(text)};
  });
}
export function validateCues(cues, duration) {
  if (!cues.length) return 'Add lyrics before creating a video.';
  for (let i=0; i<cues.length; i++) {
    const c = cues[i];
    if (!c.text.trim()) return `Line ${i+1} needs words.`;
    if (!Number.isFinite(c.start) || !Number.isFinite(c.end) || c.start < 0 || c.end <= c.start) return `Check the start and end of line ${i+1}.`;
    if (i && c.start < cues[i-1].end - 0.001) return `Line ${i+1} overlaps the previous line.`;
    if (Number.isFinite(duration) && c.end > duration + 0.05) return `Line ${i+1} ends after the music.`;
  }
  return '';
}
export function toLrc(cues) { return cues.map(c => `[${secondsLabel(c.start).padStart(8,'0')}]${c.text.replace(/\n/g,' / ')}`).join('\n'); }
export function toVtt(cues) {
  const stamp = n => { const ms = Math.round(n*1000); return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}.${String(ms%1000).padStart(3,'0')}`; };
  return 'WEBVTT\n\n' + cues.map((c,i) => `${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}`).join('\n\n') + '\n';
}
