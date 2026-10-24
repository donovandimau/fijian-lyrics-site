# Sere redesign verification — 24 October 2026

## Review scope

Preview-only redesign on `redesign/premium-discovery-20261024`, PR #3. Baseline main: `68099fac871582b85877143b2c8e539cde8fcb72`. The original task snapshot was stale: PR #1 is merged and includes supplied lyrics. PR #2 (`e708c6de950091598059d88a7d23e02f49a41265` at inspection) separately adds a larger catalogue and lyric-video studio. Neither is overwritten by this branch. This PR must remain unmerged until the owner approves the completed design.

## Preserved material and rights

- `songs.js` is byte-identical to the baseline: four IDs, titles, credits, supplied Fijian text, English translations and all current source URLs.
- Historical pending-rights records and state are retained in `docs/catalogue-rights-baseline.js` and `docs/rights-baseline-20261023.md`, from baseline commit `154eec594daf83606f11413d4b62602534c63759`.
- `rights.js` separates preview availability from original records. No pending text is inserted into rendered cards or dialogs; no recording is bundled for those four songs. Existing supplied text is still preserved in the source, so this is a presentation gate, not a confidential-data boundary.
- Lagoon 01 MP3, SVG lagoon, icon and abstract cover art are original to this revision. The reproducible instrument generator uses new oscillator/noise synthesis with no samples or vocals. Not described as an authentic traditional performance.

## Automated checks

`node --test tests/*.test.cjs`: 9 passed, 0 failed.

Tests cover exact catalogue preservation; four pending statuses; no pending lyrics/translations/recordings in song dialogs; title/credit search and no-result recovery; availability filters; favourites with blocked storage; original transport/seek/mute control behavior; legacy song deep links; initial compressed-size budget and opt-in media; real MP3 duration/stream/size.

`node --check app.js`, `node --check rights.js`, `node --check docs/responsive.js` pass. All SVG files parse as XML. All local HTML resource targets resolve. Local `ffprobe` reports MP3 duration 23.88 seconds, 286,893 bytes. Browser duration is 23.818167 seconds after MP3 decoder padding.

## Hosted browser observations

Vercel deployment `dpl_7B5m78DDp8skjnf3Q53A2qM1AtS2` is READY for commit `3028615cb6ed8cd15a72ca351b4a5615512713ec`, with target null (preview). Tested at:
https://sere-gkmyqhd6x-donovandimau-3468s-projects.vercel.app/

- Desktop page: 1348px client width, matching scroll width; five rendered cards; original SVG loaded; visible desktop hero and fixed transport inspected.
- Initial audio `readyState=0`, paused, no automatic media startup.
- Real play advances currentTime (15.792 seconds observed), decoded `readyState=4`, no audio error. Transport labels switch between Play/Pause.
- Search “isa” displays one card. Song modal preserves Isa Lei credits/source, shows pending explanation, and renders no supplied lyric/translation. Escape dismisses and returns focus to the trigger. Saved count persists after reload.
- Search “bula” displays one card on phone layout. Clear-search, four-song pending filter, save and Your collection work. Native select via exact `#viewport` was used because a strict label locator did not resolve the QA selector.
- Palette changed to Night and manual Pause visuals switched to Resume visuals. Keyboard seek Home then ArrowRight set playback to 0.1 seconds; mute set audio.muted=true.
- No first-party application errors were observed in sampled console output. Browser-extension metadata errors were present; these are not application errors. The log window is bounded, so this is not a full-session error-rate guarantee.

Responsive QA uses same-origin iframe viewports on `/docs/responsive.html`. The app's own CSS and JS run unchanged. Standard desktop scrollbars occupy 15px: 320px frame → 305px client; 390px → 375px; 768px → 753px; 1280px → 1265px. At all four widths, document scrollWidth equals clientWidth. Phone uses two card columns and a 104px fixed player; tablet/desktop use the full layout. Phone hero, cards, details and transport were visually inspected. This is responsive Chromium verification, not emulation of an Android GPU, Samsung Internet or iOS Safari.

## Accessibility and performance

- Native labelled search/select/range/button controls, named dialogs, one H1, semantic landmarks, meaningful image alt, skip link, result status, favourite pressed states, labelled external links and visible keyboard focus.
- Modal focus and Escape tested. Manual visual pause exists; `prefers-reduced-motion` disables CSS movement and sets canvas motion paused at startup. This preference path is covered by source inspection, not an operating-system settings change. High-contrast CSS supplied.
- Calculated contrast ratios: main text 11.18:1; secondary text 5.68:1; pending badge 5.75:1; available badge 6.83:1; primary button 11.09:1; session copy 8.68:1. Decorative artwork is not a substitute for the readable song title beneath it.
- Initial HTML/CSS/JS/catalogue/SVG budget is under 23 KB gzip; audio is 287 KB and preload=none. No remote font, framework, analytics or external runtime request. Canvas draws only during playback with visuals enabled and the document visible. This is a deterministic asset-size/behavior check, not a Lighthouse score or a measured mobile network/Core Web Vitals claim. Browser performance timing APIs are unavailable in this test surface.
- Physical Samsung phone, Safari/VoiceOver, a complete screen-reader audit and throttled-network measurements remain unverified.

## Final review polish

After the hosted observations above: strengthened contrast of the artwork play button and category labels, set mobile search text to 16px to avoid Safari focus zoom, and made Your collection clear a prior search. These changes require the final exact-head smoke check recorded in the PR description. No catalogue or music content changed.

## Handover

Exact sources: GitHub PR #1, PR #2, main and historical commits above; existing Vercel Sere project `prj_dK69PpFn8gKtMym8KW4TCgrODWoE`, team `team_nGGdNyLaa9MeIHP4rdUwFCsp`; source and test files in this PR. No authenticated Ops connector or installed Ops secret was available in this session, so no Ops lease/memory/write receipt is claimed. Earlier Sites work at `/workspace/sites/sere` was inspected for context and left untouched.

Next action: owner reviews the separate redesign preview and approves it or requests changes. Before an approved production release, reconcile any newer main/studio changes deliberately, remove preview-only noindex/banner as appropriate, verify the production-target build and retain the rights policy unless actual licence evidence supports changing it.
