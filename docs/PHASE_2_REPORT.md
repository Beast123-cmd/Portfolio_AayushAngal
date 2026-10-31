# Phase 2 Report — Graphite World Visual Prototype

**Status:** Prototype implemented on `feat/phase-1-accessible-experience-foundation`. Build, type-check, lint, reducer-flow, and local HTTP checks completed. Visual/browser interaction review is waiting on the user. No Phase 3 work or deployment was performed.

## Scope delivered

- Added an original graphite entrance and a short, bounded corridor with four labeled doorways: Engineering Lab, The Journey, Art Studio, and Connect.
- Added a semantic HTML waypoint register that mirrors all four corridor doors and remains outside the decorative canvas.
- Added one functioning doorway transition: the Engineering Lab door swings open while the camera moves to its threshold. Its landing is a text-only placeholder; no room interior was built. The other doors can be selected and viewed but do not open.
- Added a wall-mounted original signal-path schematic with a sketch-to-color reveal. The controls let the reviewer compare a fragment-shader reveal against a DOM/CSS clip-path reveal.
- Added keyboard destination selection (`←`/`→` or `A`/`D` while focus is outside text-entry fields), mouse drag, touch drag, pointer door activation, and a distinct keyboard-accessible “Open selected doorway” button.
- Kept the simple portfolio view, automatic WebGL fallback, `/`, `/terminal`, résumé download, existing project/experience data, and contact implementation intact.

## Files changed

- `src/pages/ExperienceShell.tsx` — prototype layout, destination menu, interaction controls, input handling, and Phase 1 fallback/simple-view reuse.
- `src/components/experience/sceneState.ts` — corridor selection, entrance transition, single supported door transition, return flow.
- `src/components/experience/CanvasRoot.tsx` — one lazy Canvas, capped DPR, no shadows, scene wiring.
- `src/components/experience/CameraDirector.tsx` — sole camera pose coordinator; smooth corridor waypoints and door transition.
- `src/components/experience/cameraControls.ts` — camera input handle shared with the scene.
- `src/components/experience/CorridorWorld.tsx` — original corridor geometry, four doors, paper texture, batched drafting strokes.
- `src/components/experience/roomLayout.ts` — canonical destination labels and doorway coordinates.
- `src/components/experience/SketchExhibit.tsx` — original shader and DOM/CSS reveal variants.
- `src/styles/experience-shell.css` — paper, graphite, accent, responsive layout, focus, and reduced-motion styles.
- `src/assets/world/world-paper-graphite-grain.svg` — original paper texture.
- `src/assets/world/world-signal-path-graphite.svg` and `world-signal-path-color.svg` — matching original line-art and accent-color samples.
- `src/assets/world/asset-manifest.json` — naming, compression, source, rights, and usage conventions.
- `PHASE_2_REPORT.md` — this report.

No dependencies, lockfiles, project content, résumé, contact backend, routing configuration, or deployment files were changed.

## Scene and camera architecture

`ExperienceShell` continues to use the Phase 1 typed reducer. Entrance, corridor, transition, and the single Engineering Lab landing are discrete application states. Door selection is separate from opening a room. The reducer rejects open requests for the three future destinations, which keeps their placeholders out of scope.

There is one lazily loaded R3F Canvas. `CameraDirector` is the only component that writes camera transforms: GSAP animates a camera-pose target, and its R3F frame callback eases that target onto the camera. The camera is never written by the React shell, a second animation loop, or a door component. A transition locks look input, kills its GSAP timeline on state change/unmount, and unlocks after completion. The same director coordinates the Engineering Lab door hinge with the camera move.

Keyboard and destination buttons select waypoints. Mouse and touch pointer drag adjust the camera look target; the destination buttons and one open action provide non-spatial alternatives. Door labels are also shown in the accessible HTML register. The canvas is marked decorative for assistive technology.

## Sketch-to-color implementation and comparison

The same original signal-path SVG is supplied in graphite and accent-color versions:

- **Shader:** one plane and a small fragment shader blend the two local SVG textures across a slightly irregular reveal edge. It loads only after selecting Shader and animates the uniform with GSAP.
- **DOM/CSS:** two semantic-page image layers use a `clip-path` wipe. It adds no exhibit plane draw call, needs no custom shader, and follows the CSS reduced-motion rule.

The prototype opens in **DOM/CSS mode** as the more robust default for this flat schematic. Shader mode remains available as an A/B comparison, not as a required effect. This is an engineering choice based on implementation complexity and fallback behavior; visual preference and runtime GPU/FPS comparison still require your browser review. The reveal button is a regular HTML control in either mode, so the interaction does not depend on hovering or clicking a WebGL mesh.

## Original asset and rights strategy

The three SVGs were authored for this prototype and use no ITom artwork, room assets, branding, copy, or bundled media. Their source/license fields are recorded in `src/assets/world/asset-manifest.json`. The naming rule is `world-[subject]-[treatment].[ext]`. Small line art stays SVG; approved raster artwork can use WebP/AVIF later. Room-specific art should load only with its room. No personal artwork or placeholder gallery content was added.

## Performance notes

- No dependency was added or upgraded. Existing React 18, Three.js 0.161, R3F 8, Drei 9, and GSAP 3 remain in use.
- One Canvas, a 1–1.5 DPR capability cap, no postprocessing, and no dynamic shadows.
- Door outlines use simple boxes. Architectural line strokes are batched into two Three.js line-segment geometries to reduce draw calls.
- The three SVG sources total **3,985 bytes**. Vite inlines these small SVGs into the lazy scene bundle.
- Production build transformed **659 modules** and completed in **3.60s**. The lazy `CanvasRoot` output is **833.13 KB raw / 225.14 KB gzip**. Main app JS is **363.40 KB raw / 113.59 KB gzip**; CSS is **93.56 KB raw / 16.49 KB gzip**.
- No browser GPU timing, FPS, texture-memory, or mobile-device measurement is claimed because browser tooling was unavailable and this prototype is awaiting your local review.
- Vite emitted the existing non-blocking warning that the Browserslist `caniuse-lite` data is 16 months old. No dependency update was made.

## Verification completed

| Check | Actual result |
|---|---|
| `./node_modules/.bin/tsc --noEmit -p tsconfig.app.json` | **Passed**, exit 0, no diagnostics. |
| `npm run build` | **Passed**, exit 0, 659 modules, 3.15s. |
| `npm run lint` | **Passed**, exit 0, 0 errors and 7 existing `react-refresh/only-export-components` warnings in UI components. |
| Scene reducer smoke flow | **Passed.** All four destinations were selectable; only Engineering Lab could open; return to corridor worked. |
| `git diff --check` | **Passed**, no whitespace errors at the time of check. |
| Local production-preview HTTP requests via Node `fetch` | `/`, `/experience`, `/terminal`, `/resume.pdf`, and the lazy `CanvasRoot` chunk each returned HTTP 200. The PDF was `application/pdf` (177,294 bytes); the scene chunk was JavaScript (833,121 bytes). These are response checks, not proof of React rendering or interaction. |
| Browser / visual interaction | **Not run.** No browser automation tool or installed browser was available. No screenshot was captured. The local development server is being left running at `http://127.0.0.1:8080/experience` for your review. |

The HTTP checks return the SPA HTML for direct paths; they do not verify the contents rendered after JavaScript executes.

## Review checklist for the running local prototype

Open `http://127.0.0.1:8080/experience` (or the Vite URL printed in the session) and review:

1. The graphite entrance, corridor silhouette, four physical door labels, and style board at desktop and narrow/mobile widths.
2. “Enter the workshop,” then select each waypoint. Confirm camera easing travels to the selected door; only the Engineering Lab doorway should open.
3. Activate the Engineering Lab door with pointer and keyboard; return with “Back to corridor.” Confirm there is no stuck camera or competing transition.
4. Use `←`/`→` or `A`/`D` with focus on the destination register; use mouse drag and touch drag over the open scene area. Confirm controls do not require hover.
5. Compare Shader and DOM/CSS modes, then toggle the color reveal with its HTML button. Review legibility, appearance, mobile cost/feel, and the preferred method.
6. Enable `prefers-reduced-motion: reduce`, then repeat corridor and reveal transitions.
7. Confirm the simple view, `/`, `/terminal`, résumé link, and existing WebGL fallback remain available. Do not submit the contact form.

## Remaining issues and Phase 3 boundary

- Please review the live local scene visually and exercise mouse, keyboard, touch, reduced-motion, and both reveal methods. Those runtime interactions are not marked passed here.
- The shader path has only been type-checked and production-built; actual GPU behavior and relative GPU cost are unmeasured.
- The DOM/CSS method is the starting default pending your review of the two variants.
- The Journey, Art Studio, and Connect doors are labeled waypoints only. Their interiors, full corridor navigation, route deep links, room content, and art gallery remain for later approved phases.
- No contact backend code or contact submission was touched.

**Phase 3 has not started.** No deployment or merge was performed. This phase stops at the prototype and waits for your review.
