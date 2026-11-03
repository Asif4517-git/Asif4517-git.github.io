# Portfolio update: real media and content

Source: user upload `Image to PDF 20261103 20.30.06.pdf`, 13 pages, visually inspected in full. Images were extracted from embedded image objects (not photographed page previews), proportionally resized and WebP-compressed. No generated replacement images.

| PDF page | Extracted asset in `images/updates/` | Placement |
| --- | --- | --- |
| 1 | `nes-build.webp` | ESP32 handheld card and case-study gallery; full hardware photo contained, not cropped |
| 2 | `desk-purple.webp` | Main rig photograph, PC setup card and case study, WLED case study, desk gallery |
| 3 | `desk-warm.webp` | WLED lighting card and desk gallery |
| 4 | `desk-wide.webp` | Desk gallery and PC setup case study |
| 5 | `desk-front.webp` | Desk gallery and PC setup case study |
| 6 | `desk-blue.webp` | Desk gallery and PC setup case study |
| 7 | `asif-23-jersey.webp` | Football section; full-size viewer |
| 8 | `neon-pdf-results.webp` | Neon Rush case study (user-supplied results screenshot, not an achievement claim) |
| 9 | `neon-pdf-race.webp` | Neon Rush case study |
| 10 | `neon-pdf-garage.webp` | Neon Rush case study |
| 11 | `neon-pdf-circuits.webp` | Neon Rush case study |
| 12 | `neon-pdf-menu.webp` | Neon Rush case study |
| 13 | `neon-pdf-controls.webp` | Neon Rush case study |

All pages matched to identifiable subjects. No separate sensor-dashboard or Wi-Fi Marauder photograph appears in this PDF. Those cards retain their existing clearly illustrative UI; unrelated desk or handheld images were not assigned to them. No standalone desktop screenshot is supplied. Desk photographs show a monitor but cannot reliably establish additional application identities, so the known tools remain unchanged. Await those missing images rather than fabricate them.

Removed superseded `images/pc-setup.webp` and all active references. Removed hero portrait markup and portrait preload; retained unrelated original portrait files for the user to manage later. Existing Three.js, local fonts, palette and core interaction system retained.

Achievements are user-supplied: 3 school wins; 2 separate sub-district third-place results; sub-district HSS second place; district fifth among 42; Little KITES membership and school-level leadership; district coding camp participation. No dates, certificates, organizers or extra titles added.

Live game browser capture: see `scripts/capture-neon.mjs` and `docs/neon-browser-capture.json`. GitHub Actions runs a real Chromium browser against the exact deployed game URL because this coding sandbox blocks that public hostname. Menu navigation and real keyboard input are used; no recreated screenshots or simulated DOM screenshots. Live captures are named `neon-live-*.webp` and are visually reviewed before selection.

Selected live captures (successful Chromium run https://github.com/Asif4517-git/Asif4517-git.github.io/actions/runs/41668600389):
- `neon-live-05-driving-boost.webp`: main project card and case-study lead image; real W + Shift input.
- `neon-live-06-driving-turn.webp`: case study; real steering and handbrake input.
- `neon-live-01-menu.webp`, `neon-live-02-garage.webp`, `neon-live-03-circuits.webp`: case-study menu/interface gallery.
- The blurred pause capture and duplicate earlier stationary race capture were discarded after visual review. All six user-supplied game screenshots remain in the case study with clear PDF-source captions.

The temporary browser-capture workflow was removed after completion. `docs/neon-browser-capture.json` records the actual live URL, observed UI, driving input action and no page errors from the successful run.
