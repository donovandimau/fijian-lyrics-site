# Sere
A searchable static site of Fijian songs with Fijian lyrics, English translations, song credits and source links. Built with plain HTML, CSS and JavaScript and no build step.

Open `index.html` to view it. To add a song, add its title, text, translation, credit and source to `songs.js`.

The initial four lyric and translation records come from the existing owner-supplied catalogue in `donovandimau/fijian-lyrics/data/songs.json` at `e42a939083f8a15e7165868cbb25c660bb745246`.

Deployed on the existing Vercel Sere project as a static site with no framework and the root as the output directory.

## Discovery redesign preview — 24 October 2026

Separate branch from the earlier rename/publication work. Open a local HTTP server (`python -m http.server 4173`) and visit http://localhost:4173. There is no build step, framework, remote font, analytics or JavaScript dependency.

- Search title, artist and credits; filter available, rights-pending or saved; sort A–Z.
- Save favourites in this browser. Blocked storage falls back to this visit only.
- Four supplied `songs.js` records remain byte-for-byte unchanged from main at `68099fa`. The preview does not render their lyrics or translations. `rights.js` restores the documented rights uncertainty in the older baseline while preserving all supplied text and current reference URLs in source control. Unknown future records fail closed.
- Original session: real MP3 playback, seeking, volume, mute, optional analyser-driven graphics and three visual palettes. No autoplay; audio is fetched only after play. Reduced-motion preferences and a manual pause control stop movement.
- The illustration in `assets/lagoon.svg`, abstract cover art, icon and Lagoon 01 composition are original to this revision. The instrumental is synthesised without samples or vocals. Reproduce with `python scripts/create-lagoon.py` (numpy + ffmpeg).
- Preview has noindex metadata/headers. Remove these only in an approved production release. No production promotion or merge is authorised by this preview request.
- Existing PR #2 (lyric-video studio/catalogue expansion) is not included or changed. Reconcile its `index.html`/`app.js`/CSS conflicts deliberately before combining. Do not replace its expanded catalogue with this four-song baseline.

Run `node --test tests/*.test.cjs` for catalogue integrity, rights gates, original-media and performance-budget checks. See `docs/verification.md` for browser observations and remaining limits.
