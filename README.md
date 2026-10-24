# Sere

Sere now includes a local lyric-video studio at `studio.html`: upload or drop audio (including a music folder), choose supplied library lyrics, import TXT/LRC/SRT/VTT, edit timing, preview three themes and three frame shapes, then create a downloadable video with the uploaded audio. Project JSON and LRC/VTT exports preserve edits. Each uploaded track keeps its own lyrics, timing and style in the session queue. Matching a supplied song's title can prefill its existing words; source-only entries still need lyrics.

Optional automatic lyrics run locally using a version-pinned Transformers.js worker and Whisper tiny. First use downloads roughly 41 MB of model files plus the runtime. Audio is not uploaded. Drafts require review, especially Fijian singing (Whisper has no Fijian language token). Local transcription is limited to 15 minutes and 150 MB to protect browser memory; manual/library lyrics and video export do not depend on it.

Video export uses Canvas + Web Audio + MediaRecorder and takes real time. The available encoder determines WebM/MP4. Keep the tab visible; hiding it cancels export so a throttled background tab cannot silently produce a broken video. The normal preview remains usable after completion or cancellation. Source audio must be playable by the browser.

The catalogue contains495 source entries: the preserved107 entries plus388 additions from the current LyricsTranslate Fijian index and18 SingPraises Fijian collections. Search and pagination cover the full dataset.409 entries have published recording links, with vocal/accompaniment/video labels retained. Direct audio sources can be loaded into the studio when they allow browser CORS access; errors preserve the project and offer the original link/file-upload route. The four supplied complete lyric texts remain intact. A source entry is not a completed lyric import or a rendered video. Each studio entry shows whether words are already supplied.

Run `node tests/lyrics-core.test.mjs` for parser/timing checks. See `THIRD_PARTY.md` for dependency sources. No build or secret keys are needed for the static app.
A searchable static site of Fijian songs with Fijian lyrics, English translations, song credits and source links. Built with plain HTML, CSS and JavaScript and no build step.

Serve this folder over HTTP to use the module-based studio (for example `python -m http.server 8000`), or use the existing Vercel deployment. To add a song, add its title, text, translation, credit and source to `songs.js`.

The source-link audit completed all107 original URLs on24October2026:72 through Firecrawl,35 through direct HTTP after account credits ended. All returned200. The catalogue includes actual Fijian source links and31 entries with source-discovered recording links. Those recording players and every linked Fijian-instance target were not exhaustively tested. Full audit evidence is saved in the Ops handover.

Expanded discovery covered58 LyricsTranslate index rows and482 SingPraises song instances grouped by original text and Fijian title. Four collections expose no indexed song list; historical editions and music outside these sources remain gaps.495 is a source-entry count, not a worldwide completeness claim or a count of finished videos. Full source/edition provenance is retained in the sourced audit; the runtime metadata is projected to the fields used by the UI.

The initial four lyric and translation records come from the existing owner-supplied catalogue in `donovandimau/fijian-lyrics/data/songs.json` at `e42a939083f8a15e7165868cbb25c660bb745246`.

Deployed on the existing Vercel Sere project as a static site with no framework and the root as the output directory.

