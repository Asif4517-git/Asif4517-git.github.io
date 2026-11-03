# Asif Shahrukh Khan

Live site: https://Asif4517-git.github.io/

## Local preview and checks

This is a static HTML/CSS/JavaScript site; there is no production bundler.

```sh
python3 -m http.server 8000 --bind 0.0.0.0
node scripts/check-site.mjs
npx --yes html-validate@8 index.html
```

GitHub Pages serves `main` at the repository root. Local fonts and Three.js are vendored; no runtime CDN is required for the portfolio.

## Real media

See [media provenance](docs/media-provenance.md) for PDF page-to-project matching and missing-media notes. New photographs are optimized WebPs in `images/updates/`. Full-size viewing uses a keyboard-accessible native dialog. Portrait files are retained but no longer displayed or preloaded.

The live-game browser capture script requires `playwright` plus Chromium (`npm install --no-save playwright`, `npx playwright install chromium`) and runs with `node scripts/capture-neon.mjs`. It visits the real public Neon Rush deployment, uses actual UI clicks and keyboard inputs, and saves original screenshots and a report in `capture-output/`; those intermediate outputs should not be committed. Selected optimized captures are stored under `images/updates/neon-live-*`.
