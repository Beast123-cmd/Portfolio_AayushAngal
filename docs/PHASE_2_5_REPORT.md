# Phase 2.5 — Immersive World Stabilization Report

**Status:** Build, lint, and TypeScript checks pass. The user's latest headed-Chrome screenshot at `/experience` still shows the Canvas fallback after the renderer-tier changes. WebGL is reported hardware accelerated globally, but app-level context creation still fails. The exact cause remains undetermined; Phase 3 is not ready to start.

## Root cause and evidence

### Confirmed

- The previous fallback was the React Three Fiber Canvas fallback. WebGL API constructors existed, and the scene had not started rendering; failure occurred while Three.js requested the renderer context.
- The owner supplied `chrome://gpu` output for Chrome 156.0.8078.49 on macOS 27.2. It reports **WebGL: Hardware accelerated**, an active Apple M3 ANGLE/Metal GPU, a GPU process crash count of 0, and a maximum of 4 MSAA samples. This rules out WebGL being globally disabled or unsupported on that machine.
- The browser did not provide a `webglcontextcreationerror` `statusMessage`. That leaves the precise per-context rejection reason unavailable from the supplied report.
- The application previously forced `powerPreference: "low-power"`. That setting was a valid but avoidable constraint. Changing renderer preferences did **not** resolve the context failure: the user's latest screenshot still shows the same fallback and no browser-provided context error status. Therefore low-power selection was not sufficient to explain the failure.

### Assessment and reference-source comparison

The evidence rules out WebGL being disabled globally, but does not identify the exact per-page context failure. The upstream source uses a normal R3F `<Canvas>` with adaptive performance tiers: high-tier devices request `high-performance` with antialiasing, medium devices use `default`, and low-tier devices use `low-power` without antialiasing. It also uses Drei's `PerformanceMonitor` to step down tiers if frame rate drops ([Canvas setup](https://github.com/ITomPoland/portfolio-itom/blob/main/src/App.jsx), [performance tiers](https://github.com/ITomPoland/portfolio-itom/blob/main/src/context/PerformanceContext.jsx)).

Our initial implementation had selected `low-power` unconditionally. That was the clearest renderer setup mismatch found. It now follows an adapted three-tier policy: mobile/medium devices use `default`, low-memory devices use `low-power`, and higher-capability devices use `high-performance`; antialiasing is disabled only for the low tier. DPR is tier-capped and Drei's existing `PerformanceMonitor` lowers DPR if it detects sustained poor frame rate. Dynamic shadows remain disabled. This removes the avoidable mismatch but is not yet proof that it fixes this user's renderer failure. The upstream also sets `failIfMajorPerformanceCaveat: true`; we intentionally do not copy this because it can reject software-rendered contexts and would cause fallback on more machines.

The source repositories use different but internally aligned Three/R3F major versions: this portfolio is on React 18, Fiber 8, and Three 0.161; current upstream package metadata uses React 19, Fiber 9, and Three 0.182 ([upstream package metadata](https://github.com/ITomPoland/portfolio-itom/blob/main/package.json)). This version difference is not evidence of the context failure, and broad upgrades are not justified. The reference's infinite corridor manager and extensive asset preloader are not appropriate for this small, bounded prototype; they would add complexity and preload media that must not be reused.

The exact underlying cause remains unknown because Chrome supplied no event status and the screenshot does not expose DevTools console output. The latest headed-browser screenshot is direct evidence that the 3D scene still does not initialize. The performance-tier adaptation is not a renderer fix; its monitor only runs after a renderer has been created.

The installed Chrome 156.0.8078.74 was also run in **headless** mode against the app. It rendered the accessible graphite fallback and emitted `CVDisplayLinkCreateWithCGDisplay failed` errors. That result is not evidence that the owner's headed Chrome cannot use WebGL: headless mode has a different display/GPU path, and the owner's separate `chrome://gpu` report confirms hardware acceleration in regular Chrome.

## Fixes

- `CanvasRoot` now uses capability-based renderer preferences and adapts DPR when the existing Drei performance monitor detects a sustained frame-rate decline. Dynamic shadows remain disabled.
- `useDeviceCapabilities` now uses three performance tiers and no longer interprets every narrow desktop browser window as a low-power device.
- `graphite-world/THIRD_PARTY_NOTICES.md` and `graphite-world/licenses/portfolio-itom-MIT.txt` record the source and include the MIT license text for the adapted performance patterns.
- `ExperienceShell` now captures WebGL context creation events, relevant window errors, and renderer-related unhandled rejections. When available, actual error text is surfaced in development details and the console. The accessible fallback remains active.
- The immersive layout makes the Canvas fill the viewport. The entrance copy, destination controls, and sketch reveal now float over the corridor without the previous framed-card grid. The four HTML destinations remain available without pointer/hover interaction.
- The WebGL-independent graphite illustration remains the fallback and simple view; no old portfolio page is restored.

## Files changed

- `graphite-world/src/components/experience/CanvasRoot.tsx` — reduced context-creation requirements while retaining one Canvas, DPR cap, and no shadows.
- `graphite-world/src/hooks/useDeviceCapabilities.ts` — replaced the coarse narrow-screen boolean with device-tier detection modeled on the reference's performance approach.
- `graphite-world/THIRD_PARTY_NOTICES.md`, `graphite-world/licenses/portfolio-itom-MIT.txt` — upstream code attribution and license notice.
- `graphite-world/src/pages/ExperienceShell.tsx` — added renderer error capture and retained accessible navigation/fallback behavior.
- `graphite-world/src/styles/experience-shell.css` — made the full-screen Canvas dominant and simplified the overlay layout for desktop/mobile.
- `PHASE_2_5_REPORT.md` — this report.

No dependencies were added or installed. No backend, deployment, or room interiors were changed.

## Verification actually completed

| Check | Result |
|---|---|
| `npm run build` | **Passed**, exit 0; 646 modules, 2.18s. Lazy Canvas chunk: 834.80 KB raw / 225.85 KB gzip. Vite warned that the local Browserslist data is 16 months old; no update/install was run. |
| `npm run lint` | **Passed**, exit 0; no warnings or errors in the active frontend. |
| `npx tsc --noEmit -p tsconfig.app.json` | **Passed**, exit 0; no diagnostics. The first check caught a missing React hook import during the adaptation; it was fixed and the final check passed. |
| Owner-supplied regular Chrome `chrome://gpu` report | **WebGL hardware acceleration confirmed** on Apple M3; zero GPU-process crashes. This verifies browser/GPU capability, not this site's Canvas. |
| Installed Chrome headless runtime | **Fallback reproduced**, not counted as a supported-browser visual test. The browser emitted display-link/task-policy errors; headless GPU behavior differs from the owner's regular Chrome. |
| User-supplied headed Chrome screenshot after this fix | **Failed:** screenshot at `127.0.0.1:8080/experience` shows the accessible fallback and reports WebGL context creation failed. It also shows WebGL API constructors as functions and no context-creation status message. |
| Corridor navigation, door swing, return transition, keyboard/touch, reduced motion | **Not visually/runtime verified.** Source inspection confirms a single `CameraDirector` owns camera movement and the reducer exposes the transitions; this is not a browser pass. |

## Required owner retest

To separate browser context restrictions from app setup, open DevTools Console on `http://127.0.0.1:8080/experience` and run this small isolated context probe. Each context is created on its own temporary canvas and immediately released:

```js
(() => {
  const types = ["webgl2", "webgl", "experimental-webgl"];
  const results = types.map((type) => {
    const canvas = document.createElement("canvas");
    try {
      const context = canvas.getContext(type, { alpha: false, antialias: false, powerPreference: "default" });
      const attributes = context?.getContextAttributes?.() ?? null;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      return { type, created: Boolean(context), attributes };
    } catch (error) {
      return { type, created: false, error: String(error) };
    }
  });
  console.table(results);
  return results;
})();
```

If these isolated contexts also fail, the limitation is browser/profile/GPU-context availability. If they succeed but the app fails, capture the console output around the `[experience]` messages; that points to an application/R3F renderer setup issue. A successful app test must still show the 3D corridor and log `[experience] WebGL 2 Canvas initialized successfully.` Then exercise door selection and keyboard/touch controls.

If it still falls back, expand **Development diagnostic details** and send the full text and the matching `[experience]` console error. The new capture should expose the thrown renderer error if Chrome dispatches it. Keep the fallback enabled.

## Remaining issues and Phase 3 readiness

- The user's headed Chrome still fails to create the renderer after the revised context request. Do not describe 3D rendering or navigation as fixed/passed.
- The isolated canvas probe and browser console output are still needed to distinguish a browser/profile context restriction from an app-level initialization issue. `chrome://gpu` alone cannot distinguish these per-page causes.
- Camera waypoint movement, physical doorway appearance, Engineering Lab door animation, and return transition remain pending visual/runtime review.
- **Phase 3 readiness: not ready.** Wait for a successful headed-Chrome walkthrough and approval. No Phase 3 work or deployment was performed.
