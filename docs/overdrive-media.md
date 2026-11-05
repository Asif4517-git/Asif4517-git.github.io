# OverDrive: separate portfolio project

OverDrive is independent of Neon Rush. Its card uses the same existing `project-card featured reveal`, `card-live`, chips and case-study/gallery components; no global CSS, fonts, colors, sections or existing project entries were changed. All 13 previous cards were checked byte-for-byte against their original HTML. Existing case-study data is unchanged.

## Real browser capture

Live game: https://asif4517-git.github.io/overdrive/

A real Chromium browser in GitHub Actions first inspected the public portfolio at desktop/mobile sizes, opened the existing Neon Rush modal as a layout reference, and then navigated to the separate OverDrive deployment. The script clicked Garage and Circuits, selected the M3 Competition, started an event, accelerated using real W key input and switched the camera with C. It then navigated back to the live home page, selected Munnar Hillclimb through its circuit card, started that event and drove there too. No debug stepping, repository screenshots or generated images were used.

Run: https://github.com/Asif4517-git/Asif4517-git.github.io/actions/runs/42048046302

Reproducible script: `scripts/capture-overdrive.mjs` (Playwright + installed Chromium). Browser UI/style evidence and captured screen text: `docs/overdrive-browser-capture.json`.

## Selected screenshots

| WebP asset in `images/overdrive/` | Capture resolution | Use |
| --- | --- | --- |
| `04-circuit-driving.webp` | 1280 × 720 | Card thumbnail + gallery lead; Greater Noida Speedway, actual driving |
| `06-munnar-driving.webp` | 1280 × 720 | Munnar Hillclimb gameplay gallery |
| `01-menu.webp` | 1440 × 810 | Main menu gallery |
| `02-garage.webp` | 1440 × 810 | Actual garage / 3D vehicle viewer gallery |
| `03-circuits.webp` | 1440 × 810 | Circuit selection gallery |

1440px menu captures and 1280px gameplay captures balance legibility with software-WebGL capture performance. Images are proportionally encoded as quality-88 WebP, ~64–107 KB each, around 375 KB combined. All below-fold images use lazy loading and asynchronous decoding. The two off-road screenshots were discarded after visual review in favor of clean gameplay. Originals are not committed; no external asset host is required.

## Checks

`node scripts/check-site.mjs`, `npx --yes html-validate@8 index.html`, local Chromium QA at 1440×900, 390×844 and reduced-motion 834×1112. Evidence: `docs/overdrive-portfolio-qa.json`.

Checked 14 cards total, 5 Web & Games cards, matching styles, five gallery images loading at their real dimensions, both exact external destinations opening new tabs, nested full-size image viewing / Escape / focus return, unchanged Neon Rush gallery with 11 images, mobile navigation, no horizontal overflow, no broken images and no browser errors. Local popup tests intercept outbound navigation because sandbox egress is restricted; the actual deployed game was separately opened and played in the GitHub-hosted browser.
