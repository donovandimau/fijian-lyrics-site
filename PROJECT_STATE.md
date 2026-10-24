# Sere project state — 24 October 2026

- Four songs have Fijian lyrics and the supplied English translations: Meda Dau Doka, Isa Lei, Bula Maleya and Loma ni Buca.
- Song text is restored from the owner's existing `fijian-lyrics/data/songs.json` catalogue at `e42a939083f8a15e7165868cbb25c660bb745246`; no external lyric text was fetched.
- The warning placeholders, legal-status notes and old footer are removed. Song credits and reference links remain.
- The owner explicitly instructed publication of this revision on 24 October 2026, including the Sere rename.
- Canonical repository: `donovandimau/sere` (existing repository ID1431143213). Existing Vercel project ID: `prj_dK69PpFn8gKtMym8KW4TCgrODWoE`.
- The separate historical repository and parked catalogue draft are preserved.

## Discovery redesign review — 24 October 2026

- Separate branch: `redesign/premium-discovery-20261024`; pull request #3. Preview only; approval required before merge or production publication.
- Premium responsive discovery, search/filters, browser-local saved songs, source-detail dialogs and an original Lagoon 01 instrumental with playback and optional audio-reactive graphics.
- Existing four `songs.js` records remain byte-identical to `68099fa`. The preview restores the earlier documented rights uncertainty in `rights.js`; it does not display pending lyrics/translations or play protected recordings. Historical source notes are retained under docs.
- PR #1 has already merged; the task's earlier rename-only/open snapshot was superseded. PR #2's separate lyric-video studio/catalogue work remains intact.
- Checks and limitations: `docs/verification.md`. Next: owner reviews the completed preview and approves it or requests changes.
