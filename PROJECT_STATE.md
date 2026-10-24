# Sere project state — 24 October 2026

Current revision: music-upload-to-lyric-video studio, task726 lease1, claimed branch `agent/codex/build-sere-music-upload-and-lyric-video-studio/1`, based on existing production `68099fac871582b85877143b2c8e539cde8fcb72`.

- Studio: local audio drop/upload and track queue, supplied/imported lyrics, optional local ASR, editable/tap timing, three themes and three aspect ratios, actual audio-backed video export with cancellation, project save/open and LRC/VTT export.
- Local first-load transcription succeeded on the official11-second speech fixture. This verifies the browser/model pipeline, not Fijian singing accuracy. Whisper has no Fijian language token.
- All107 saved catalogue source pages were retrieved:72 Firecrawl and35 direct HTTP after Firecrawl credits ended. All original source pages returned200;107 Fijian source links and31 entries with recording-source links were found. Recording links were not playback-tested; linked Fijian-instance targets were not exhaustively fetched.
- All107 distinct source records are searchable and selectable; four supplied complete lyric records remain intact. The catalogue has no imported new full lyric texts or audio files. It is not107 completed videos. Videos require recordings and words/timings.
- Actual6-second local test export contains VP8video+audibleOpusaudio; frames show the correct two lyric lines. Parser, import, validation, cancellation, missing-timestamp and mobile-layout checks pass. Final preview/encoding checks are recorded in Ops artifacts/handover rather than guessed here.
- Canonical existing GitHub/Vercel identities are unchanged. No new app, backend, service credentials, storage, account or protection grants were created.

Previous approved baseline:

- Four songs have Fijian lyrics and the supplied English translations: Meda Dau Doka, Isa Lei, Bula Maleya and Loma ni Buca.
- Song text is restored from the owner's existing `fijian-lyrics/data/songs.json` catalogue at `e42a939083f8a15e7165868cbb25c660bb745246`; no external lyric text was fetched.
- The warning placeholders, legal-status notes and old footer are removed. Song credits and reference links remain.
- The owner explicitly instructed publication of this revision on 24 October 2026, including the Sere rename.
- Canonical repository: `donovandimau/sere` (existing repository ID1431143213). Existing Vercel project ID: `prj_dK69PpFn8gKtMym8KW4TCgrODWoE`.
- The separate historical repository and parked catalogue draft are preserved.

