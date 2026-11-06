# Meaningful project previews and ASIF particles

## Preservation

All seven existing photo/screenshot card assets are unchanged: Neon Rush, OverDrive, JLN, ChemLab, handheld prototype, WLED desk and PC setup. No real photo was overwritten or replaced. Photo cards retain their assets and use only a subtle frame/hover response. Existing project descriptions, case studies, links, filters, card dimensions and the Three.js workbench are preserved. The new CSS is an isolated additive layer.

## Seven project-specific miniature previews

- School TV: clock, rotating notices, Malayalam text and a school announcement ticker. All content is explicitly illustrative.
- Sensor dashboard: MQ-135 raw ADC sample values, needle gauge, an I²C-style LCD and a tracing history graph. No ppm/calibrated readings or hardware connections are claimed.
- Radio: speaker cone, sample stream selection, Wi-Fi → stream URL → I²S signal chain and simulated audio trace. No audio playback or fake live station.
- Marauder: real upstream documentation image with an adjacent illustrative topology, labelled “Upstream reference · not my device” and “TOPOLOGY DEMO.” No scanning, network access or offensive functionality.
- AirChat: clearly labelled sample conversation, relay-status treatment and staged incoming/outgoing bubbles. No dummy input controls or claimed real messages.
- Billing: illustrative notebook/pen rows with quantities and correctly staged sample totals 0 → 80 → 90. No real transactions.
- RC: original vector cutaway of a car showing chassis, battery, motor, receiver antenna and steering servo. Rotating wheels and an animated power route explain mechanical relationships. It is labelled illustration, never represented as a photo of the user's build.

### External image attribution

`images/references/marauder-screen.webp` is a resized/converted copy of:
https://github.com/justcallmekoko/ESP32Marauder/blob/master/pictures/marauder%20screen.jfif

Source repository: Just Call Me Koko / ESP32Marauder. Its root MIT license covers the software and associated documentation files, copyright (c) 2020 Just Call Me Koko. The complete license is preserved at `docs/licenses/ESP32Marauder-MIT.txt`. The source image was visually inspected before use. This is an upstream annotated device-screen reference, not a new screenshot of the user's hardware. No stock RC photograph was substituted for the user's original projects.

## ASIF particle lettering

The visible canvas contains only particles; an offscreen text raster supplies ASIF target positions in the existing local Syne font. Local cursor repulsion, damped springs, bounded displacement, warm orange/white sprites and subtle idle motion keep the word legible. Touch input gets a short impulse without preventing normal page scrolling.

No new library or WebGL context. DPR is capped, idle drawing is throttled, offscreen/background rendering stops. Reduced motion shows static particles. Native text remains accessible and serves as the no-Canvas/no-JS fallback. Resize, font readiness, page visibility, BFCache and permanent page teardown are handled. Project CSS animations and sample-value timers pause offscreen and in background tabs, and are disabled for reduced motion.

## Validation

Local Chromium at 1440×1000 and mobile 390×844, plus reduced-motion and Canvas-disabled modes. Tested particle pixel changes during interaction, stable offscreen rendering, static reduced-motion particle lettering, 14 cards, 7 photo cards / 7 custom previews, same 207px visual height, Web & Games filter count 5, OverDrive gallery 5, zero horizontal overflow and no browser console/page errors. Results in `docs/project-visuals-qa.json`. HTML validation and all new JavaScript syntax checks pass.

## Full-name and contact extension

The particle engine now initialises independently for `ASIF`, `Shahrukh`, `Khan.` and the contact heading `Let’s build something.`. Each retains native accessible/fallback text. The contact heading wraps to two centered particle lines on mobile; email, copy and social controls remain normal interactive elements. All instances share the same physics implementation but pause individually offscreen.

The original circular cursor is replaced by a small warm-orange directional nib and trailing diamond, with compact hover/click states. It reuses the existing positioning loop. Native cursors remain available on coarse-pointer devices, for reduced motion, without JavaScript and inside modal dialogs. The custom pointer hides when leaving the page or losing focus.

Browser checks at desktop 1440px, touch/mobile 390px and reduced-motion tablet 834px verified all four particle headings, actual particle displacement from mouse/touch input, static reduced-motion rendering, correct email target, no horizontal overflow, modal cursor safety and zero page errors. See `docs/particle-headings-qa.json`.

## Contact fallback layout repair

Removed the fixed contact-heading height. Its native fallback now participates in normal centered flow and reserves the actual wrapped height, whether particles initialise, are blocked, or JavaScript is disabled. Versioned preview CSS, particle/previews scripts and cursor main script prevent older cached assets being mixed with the updated heading markup. Local asset checks strip query strings before filesystem validation.

Regression checks at 390, 773, 834 and 1440px in all three loading modes confirm zero horizontal overflow, exact centering, a 16px heading-to-description gap and a 28px description-to-email gap. Actual interactive pointer/touch heading tests were rerun separately and passed. Evidence: `docs/contact-layout-regression.json` and `docs/particle-headings-qa.json`.
