# Phase 2.6 — Graphite Visual Overhaul + Continuous Navigation

## Summary

The corridor now renders with a warm-paper base, soft structural outlines, construction strokes, and sparse pencil hatching. The oversized intro and study panels are reduced after entering the scene. Bounded wheel/trackpad and held-key movement have been added to the existing `CameraDirector`; the HTML waypoint register and simple-view fallback remain available.

## Before and after

- **Before:** the headed Chrome view showed near-black corridor surfaces and background with sharp white door slabs. DevTools showed WebGL texture-upload warnings (`texSubImage2D: bad image data` and `Texture is immutable`) during the corridor render.
- **After:** a fresh local Chrome view showed an ivory corridor, warm wall/floor/ceiling planes, fine construction marks and hatching, and distinguishable door outlines. The Canvas status read “WebGL 2 Canvas initialized.” The console showed the React Router advisory and Canvas success log; the prior texture-upload warnings were not visible in that fresh view.
- Local captures during review: `/tmp/phase2-6-corridor.png` (before material adjustment), `/tmp/phase2-6-console.png` (initial console warnings), and `/tmp/phase2-6-corridor-paper.png` (updated appearance; DevTools remained open).

## Material and texture implementation

- Added `PencilStyle.tsx` with reusable warm-paper materials, softer graphite structural edges, a lighter offset construction-edge pass, and batched linework material.
- The corridor's authored SVG paper grain is now a CSS overlay over the Canvas rather than a sampled WebGL texture. This avoids the invalid texture upload path observed in Chrome while preserving original fibers and hatch marks.
- Corridor surfaces use flat, matte `meshBasicMaterial` paper tones. Tonal distinction comes from separate warm surface shades, structural edges, double-drawn construction edges, floor/wall hatching, and the paper-grain overlay. No metallic material, dynamic shadow, shader postprocessing, or new dependency was added.
- Door outlines use graphite tones; a selected door receives a restrained warm accent. The signal-path color reveal stays graphite by default and remains user-triggered.
- `CanvasRoot` sets the scene and renderer clear color explicitly to warm paper.

## Navigation and immersion

- Following the reference hook's full-page listener pattern, a non-passive `window` wheel listener handles input anywhere inside the experience shell. Scroll down / positive wheel delta moves forward; scroll up moves backward. Wheel line/page modes are normalized to pixels, each input is bounded, and camera position is clamped to the corridor from `z=-13.05` to `z=3.35`.
- A forward scroll from the entrance starts the corridor transition and queues its scroll distance, so the first scroll does not require the user to click “Enter” first. The duplicate post-entry waypoint tween is skipped to preserve that queued distance.
- W / ArrowUp move forward; S / ArrowDown move backward while held. Movement integrates with frame delta and has a focus-loss/key-up reset.
- A / D and ArrowLeft / ArrowRight continue selecting door waypoints. Existing destination buttons remain usable without hover. Mouse drag still controls looking.
- `CameraDirector` remains the only owner of camera transforms. Its lock pauses wheel and held-key movement during GSAP doorway transitions. Reduced-motion mode continues to snap the camera to waypoints.
- The intro, waypoint register, signal-path controls, and project details are smaller while in the world; the HTML content and controls remain in the DOM. The touch destination buttons and simple-view action remain in place.

## Files changed

- `graphite-world/src/components/experience/PencilStyle.tsx` — reusable matte paper material and graphite edge/linework components.
- `graphite-world/src/components/experience/CorridorWorld.tsx` — warm surfaces, softened outlines, and batched floor/wall hatching; removed sampled SVG maps from corridor surfaces.
- `graphite-world/src/assets/world/world-paper-graphite-grain.svg` — locally authored, filter-free paper fibers and hatch texture for CSS rendering.
- `graphite-world/src/components/experience/CanvasRoot.tsx` — explicit warm renderer and scene clear color.
- `graphite-world/src/components/experience/cameraControls.ts` — forward/back camera control interface.
- `graphite-world/src/components/experience/CameraDirector.tsx` — frame-rate-independent walk input, bounds, and transition lock.
- `graphite-world/src/pages/ExperienceShell.tsx` — normalized wheel handling, held-key movement, updated control hint, and compact in-world state class.
- `graphite-world/src/styles/experience-shell.css` — CSS paper overlay and reduced in-world control panels.
- `PHASE_2_6_REPORT.md` — this report.

## Performance impact

- No dependencies or external assets added. The grain SVG is a small local file and is composited as a CSS background; it is not uploaded as a WebGL texture.
- Floor and wall hatching is batched into one line-segment geometry and one draw call (roughly 700 short strokes, under 20 KB of vertex data before driver overhead).
- The secondary edge pass adds a small number of line draws to existing architectural surfaces. There are no shadows or full-screen postprocessing passes.
- Latest production build reports the `CanvasRoot` lazy chunk at **164.01 kB raw / 53.72 kB gzip**, the separate Engineering Lab chunk at **6.97 kB / 1.90 kB gzip**, and the Three.js chunk at **670.99 kB / 172.78 kB gzip**. Build time was **1.85 s**. No runtime FPS or GPU-memory benchmark was collected.

## Verification

### Checks completed

- `npx tsc --noEmit -p tsconfig.app.json` — passed, exit 0.
- `npm run lint` — passed, exit 0, no diagnostics.
- `npm run build` — passed, exit 0. Vite emitted the existing stale `caniuse-lite`/Browserslist-data notice; no dependency update was run.
- Headed Chrome at `http://127.0.0.1:8080/experience` — the corridor rendered and reported WebGL 2 initialization. The updated view showed warm-paper planes and pencil-style marks. The console had the WebGL initialization success log.

### Not verified directly in the browser

- Physical mouse-wheel and trackpad navigation, including actual motion at corridor endpoints.
- Held W/S and arrow-key movement and door selection after the visual change.
- Door opening, return to corridor, and the signal-path reveal after the visual change.
- Reduced-motion behavior in a browser session.
- Mobile layout/touch interaction and the WebGL-disabled fallback.

The movement path and guards were inspected in code, but that does not count as an interaction test. The above items remain for visual review and hands-on confirmation.

## Remaining issues

- The Chrome texture errors were observed while the corridor used sampled SVG textures. Removing GPU texture sampling from corridor surfaces eliminated the dark appearance in the updated view; this does not establish which individual browser/driver upload constraint produced those warnings. The original authored grain is now rendered through CSS instead.
- Wheel, keyboard, reduced-motion, mobile, door, and reveal interactions require direct browser exercise before acceptance.
- The existing Browserlist data warning remains unchanged.

No deployment, merge, Phase 4 work, dependency installation, or dependency upgrade was performed.
