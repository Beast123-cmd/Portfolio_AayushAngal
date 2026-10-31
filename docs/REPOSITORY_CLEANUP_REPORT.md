# Repository Cleanup Report

## Goal and boundary

The active website is now Graphite-only: `/` and `/experience` open the Graphite experience, while `/terminal` remains available as a content and navigation utility. Legacy landing-page UI and duplicate Graphite application scaffolding were removed. This cleanup did not implement new visual assets, room interiors, or Phase 3 work. Nothing was committed, pushed, merged, or deployed.

## Why the repository had duplicate code

The prior Graphite implementation had been placed in a separate `graphite-world/` tree while the original root portfolio files were restored for preservation. That left two competing app trees and left most original landing-page components unreachable from the app entry. The repository also contained a static Terminal HTML entry alongside its React route, an oversized lockfile with dependencies unused by the active app, and historical reports that described earlier layouts.

The active Graphite source now lives in `src/graphite/`. Imports, Vite aliases, TypeScript inclusion, Tailwind scanning, and README structure were updated to match. Historical reports remain in place as records of prior work; their old paths are historical, not live imports.

## Removed and consolidated

- Removed the separate `graphite-world/` application tree after consolidating its live source under `src/graphite/`.
- Removed 71 unreachable legacy landing-page and duplicate experience source/style files, plus the obsolete static `terminal/index.html` entry. The routed React terminal remains.
- Removed homepage-only images and the unused placeholder image. Kept the Graphite favicon at the standard public path.
- Removed 38 unused runtime dependencies and one unused development dependency from the package manifest and lockfile. No dependency versions were upgraded. The existing `node_modules` was reconciled offline with `npm prune --offline --ignore-scripts --no-audit --no-fund`; npm reported 46 packages added from its available cache. No network install was run.
- Moved the MIT license text and attribution into `../licenses/portfolio-itom-MIT.txt` and `docs/THIRD_PARTY_NOTICES.md`.
- Rewrote the README for the single active app tree and current routes.

No broad reset or `git clean` was used. Existing untracked phase reports, preservation reports, and reference materials were kept.

## Preserved functionality and source data

- Existing typed project records, project screenshots and links.
- Experience, education, skills, certifications, achievements, and résumé information. The preserved recognition records are in `src/data/recognition.ts` and remain available in the terminal and readable fallback.
- Résumé PDF, certificate PDFs, social preview, robots metadata, and other retained public assets.
- Existing contact form and backend API contract; no contact submission was made.
- `/terminal` React route and its existing content commands.
- `/` and `/experience` direct SPA routes through the existing Vercel rewrite.
- Graphite scene, single Canvas, WebGL diagnostics and accessible fallback, and the centralized `CameraDirector`.
- Existing WebGL source notices and reference materials.

## Current structure

```text
src/
├── graphite/       # Sole immersive experience, scene, camera, fallback and room prototype
├── components/     # Contact form, terminal and UI primitives still used by those features
├── data/           # Canonical portfolio content
├── hooks/          # Shared toast support
├── lib/            # Shared utility
├── pages/          # Terminal and not-found routes
└── App.tsx         # Graphite routes and terminal route
backend/            # Existing contact and résumé API
public/             # Résumé, certificates and public metadata/assets
references/         # Reference material, not runtime assets
licenses/           # Third-party license text
```

## Verification performed

- `npm run build` — passed. Vite transformed 1,140 modules and built successfully in 2.87 seconds. The Three.js chunk is 670.99 kB raw / 172.78 kB gzip; the Graphite Canvas chunk is 164.29 kB raw / 53.79 kB gzip. Vite printed a stale `caniuse-lite` notice.
- `npx tsc --noEmit -p tsconfig.app.json` — passed with no diagnostics.
- `npm run lint` — passed with 0 errors and 2 existing Fast Refresh warnings in `src/components/ui/button.tsx` and `src/components/ui/form.tsx`.
- `git diff --check` — passed.
- `npm ls --depth=0` — all declared top-level dependencies resolved; no extraneous-package warning remained after offline pruning.
- Production preview HTTP checks — `/`, `/terminal`, `/experience`, `/resume.pdf`, `/hsc_certificate.pdf`, `/ssc_certificate.pdf`, and `/favicon.svg` returned HTTP 200 with expected HTML, PDF, or SVG content types. These checks confirm served files and SPA fallback responses, not React rendering or visual behavior.
- The Vite preview process started for these checks was stopped afterward.

## Remaining issues and readiness

- No browser visual/interactions test was performed in this cleanup pass. The previous WebGL diagnostics and fallback remain, but this report does not claim that a browser rendered the scene.
- Lint retains two non-blocking Fast Refresh warnings. The stale Browserslist data notice also remains.
- The production Three.js chunk remains relatively large. Further scene-level optimization should be measured and handled as its own scoped task.
- The retained terminal route is a utility; it is not a second portfolio landing page. The visible portfolio identity is Graphite.

Repository cleanup and command-level verification are complete. This is not approval to begin visual asset work, Phase 3, or deployment.
