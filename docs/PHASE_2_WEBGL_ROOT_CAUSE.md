# Phase 2 — WebGL Initialization Root Cause

**Status: Fixed and verified in headed Chrome.** The portfolio's WebGL capability was not the problem. A Canvas fallback child reported failure immediately and caused the application to unmount the Canvas before React Three Fiber could finish initializing it.

## Root cause

The prior `CanvasRoot` passed an `UnavailableNotice` component through R3F's `<Canvas fallback={...}>` prop. That component called the application's `onUnavailable` callback in a React effect. The fallback element is ordinary React content attached to the Canvas element; its effect ran even while WebGL was available. The callback set `renderFailure`, which replaced/unmounted the Canvas during its own initial mount. This created the misleading “WebGL context creation failed” UI before R3F had an opportunity to create its renderer.

Evidence supports this diagnosis:

- The temporary WebGL2 and WebGL1 probes both created contexts and explicitly released them on separate temporary canvases.
- The native Three.js comparison initialized a renderer in the same Chrome tab.
- The minimal R3F Canvas initialized with its default renderer settings after the premature fallback callback was removed.
- The normal graphite Canvas then initialized as WebGL 2 and rendered the corridor in that same tab.

This was an application Canvas lifecycle bug, not a GPU or general browser limitation. The prior diagnostic text incorrectly attributed it to context creation.

## Fix

- Removed the `UnavailableNotice` Canvas child and its callback. Actual initialization and scene exceptions are captured by the existing outer `CanvasErrorBoundary`, Canvas creation event listener, and development error logging.
- Kept capability gating and the accessible graphite fallback for genuinely unsupported WebGL or captured failures.
- Kept the minimal diagnostic query mode independent of the capability gate and custom Canvas options. It uses a single R3F Canvas with default renderer settings, one box, and one ambient light.
- Corrected the diagnostic banner to say “default R3F renderer settings.”
- Kept temporary WebGL1/WebGL2 checks sequential, on separate canvases, with explicit cleanup; they do not share a canvas with R3F.

## Browser evidence

Tested on October 31, 2026 in the user's headed Google Chrome session at `http://127.0.0.1:8080/experience`:

| Check | Result |
|---|---|
| `?r3f-test=minimal` diagnostic | Visible blue box; page reported Canvas mounted and renderer initialized as WebGL 2. Temporary WebGL1 and WebGL2 probes reported successful creation and cleanup. |
| Native Three.js comparison | Renderer initialized successfully in the same page/tab (captured during diagnostic isolation). |
| Normal `/experience` | Graphite 3D corridor rendered, including physical door geometry and the sketch exhibit. Page status read “WebGL 2 Canvas initialized.” |
| Engineering Lab doorway | Activated “Open selected doorway”; transition reached the landing and showed “Back to corridor.” |
| Return transition | Activated “Back to corridor”; returned to the corridor view and destination controls. |
| WebGL-disabled fallback | Not simulated in Chrome during this fix. Source fallback remains enabled when capability detection reports unsupported WebGL or an actual caught initialization/rendering error occurs. |

Screenshots were captured locally during the session at `/tmp/portfolio-r3f-fixed-minimal.png`, `/tmp/portfolio-r3f-graphite-fixed.png`, `/tmp/portfolio-door-open.png`, and `/tmp/portfolio-door-return.png`. They are temporary evidence and are not included in the project.

## Files changed

- `graphite-world/src/components/experience/CanvasRoot.tsx` — removed the misleading Canvas fallback callback so it cannot tear down a healthy renderer during mount.
- `graphite-world/src/pages/ExperienceShell.tsx` — retained diagnostic and real error reporting; corrected the minimal-mode banner wording.
- `PHASE_2_WEBGL_ROOT_CAUSE.md` — recorded diagnosis, fix, and runtime evidence.

## Checks

| Command | Result |
|---|---|
| `npm run build` (from `graphite-world/`) | Passed; 646 modules, 2.10s. Vite printed only the existing stale Browserslist database notice. |
| `npm run lint` (from `graphite-world/`) | Passed; exit 0. |
| `npx tsc --noEmit -p tsconfig.app.json` (from repository root) | Passed; exit 0. |

No dependencies were added or installed. No deployment or Phase 3 work was performed.

## Remaining limitations

- The accessible fallback has not been browser-tested with WebGL actually disabled after this change.
- Chrome showed the corridor and transitions, but no performance benchmark was collected.
- The temporary diagnostic route and probes are development-only; do not treat them as a production troubleshooting UI.
