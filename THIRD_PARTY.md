# Software used by Sere Studio

Sere's studio UI, lyric timing parser and canvas renderer are implemented in this repository.

- [Transformers.js 3.8.1](https://github.com/huggingface/transformers.js/tree/3.8.1), Apache-2.0, loaded from the version-pinned jsDelivr package in the optional transcription worker.
- [Xenova/whisper-tiny](https://huggingface.co/Xenova/whisper-tiny), ONNX conversion of OpenAI Whisper tiny, MIT. Model and runtime downloads are fetched on first local transcription. Uploaded audio is processed in the browser worker.
- [REA](https://github.com/morluto/rea), MIT, used during development for static source analysis. It is not shipped in the app.

Research references include the public [nomadkaraoke pipeline](https://github.com/nomadkaraoke/karaoke-gen) and [Immersive Audio Player & Lyric Video Maker](https://github.com/dotslashgabut/immersive-audio-player-lyric-video-maker). Their source is not bundled or copied into Sere.

Browser media APIs select an available WebM or MP4 encoder at runtime. Local transcription is a draft, with no guarantee of accurate singing recognition; Whisper has no dedicated Fijian language token. Imported words, timing edits and video export work independently of transcription.
