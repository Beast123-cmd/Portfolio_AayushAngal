# Phase 2 WebGL fallback fix

**Status:** Chrome exposes WebGL APIs but cannot create the Canvas context; the platform reason remains unknown. The active site now contains only the graphite workshop, and a responsive original SVG graphite illustration replaces the legacy portfolio as the no-WebGL/simple-view fallback. The local dev server remains available at `http://127.0.0.1:8080/`. The 3D Canvas itself remains unverified in the owner's Chrome.

## Root cause and evidence

The Phase 2 capability hook created a temporary WebGL context during the component's initial state calculation, called `WEBGL_lose_context.loseContext()` immediately, and then reported WebGL as available. Context loss is asynchronous, so this probe could leave a live/loss-pending GPU context while React Three Fiber initializes its own Canvas. It was an unnecessary, destructive probe and could interfere with the real context on browsers with constrained context/GPU resources.

The previous experience shell collapsed two distinct conditions into the same generic portfolio fallback: `capabilities.webgl === false` and `rendererFailed === true`. The outer error boundary also discarded the caught exception. Therefore the exact branch taken in the user's browser could not be determined from the displayed message alone. The destructive probe was a confirmed defect and has been removed, but it was not the only blocker: after that fix, the user retested and the application still reported the React Three Fiber context-creation fallback. This establishes that the current browser is reaching the real Canvas context-failure path. The underlying platform reason (for example, GPU policy, disabled acceleration, or a browser resource restriction) is still unknown because the first fallback did not capture the browser event status.

A stale dev server was ruled out: the process on port 8080 runs Vite from this project directory, and its served capability module matched the project source (including the old `loseContext` call before the fix). After the change, the same server returned the updated module with no `getContext()` or `loseContext()` probe.

## Files changed

- `src/hooks/useDeviceCapabilities.ts` — now waits until a browser effect to read browser APIs, checks only for WebGL API constructors, and no longer allocates or loses a probe context.
- `src/components/experience/CanvasErrorBoundary.tsx` — forwards the caught `Error` and React component stack to its diagnostic callback.
- `src/components/experience/CanvasRoot.tsx` — reports successful Canvas initialization and WebGL version, separates scene errors from Canvas initialization, and preserves R3F's real context-creation fallback.
- `src/pages/ExperienceShell.tsx` — records and displays distinct fallback reasons and development details; captures the browser `webglcontextcreationerror` status message and browser/API metadata; logs the actual error and component stack; keeps the readable portfolio fallback.
- `src/styles/experience-shell.css` — keeps long development diagnostics readable and scrollable.
- `PHASE_2_WEBGL_FIX.md` — this report.
- `graphite-world/` — isolated active frontend containing the graphite scene and its WebGL-independent illustrated fallback.
- Root `index.html`, `vite.config.ts`, and `tsconfig.app.json` — point the app/build/type-check at `graphite-world/` only; the old portfolio and terminal frontend were moved outside the repository to `/tmp/aayush-portfolio-legacy-20261031/` as a reversible backup. The backend was left in place.

No dependencies, homepage, contact backend, room content, or deployment configuration were changed.

## Fix and diagnostics

- The initial render reports graphics capability as pending. Browser capability detection runs after mount, preventing server rendering or early module evaluation from reading browser globals.
- The hook checks whether `WebGLRenderingContext` or `WebGL2RenderingContext` exists without acquiring a second GPU context. React Three Fiber's Canvas is the sole context creation attempt.
- Successful initialization logs `[experience] WebGL 1/2 Canvas initialized successfully.` in development and shows the version in the experience intro.
- The fallback identifies one of: **WebGL unsupported**, **WebGL context creation failed**, **Canvas initialization error**, or **Scene rendering error**. Development mode exposes diagnostic details on the page and logs caught exceptions/component stacks in the console.
- A genuine WebGL limitation still uses the complete accessible portfolio fallback. The fallback is not bypassed.

## Tests performed

| Check | Result |
|---|---|
| `npm run build` | **Passed**, exit 0; 659 modules, 3.11s. The lazy Canvas chunk is 833.25 KB raw / 225.21 KB gzip. |
| `npm run lint` | **Passed**, exit 0; 0 errors and 7 existing Fast Refresh warnings in UI components. |
| `npx tsc --noEmit -p tsconfig.app.json` | **Passed**, exit 0, no diagnostics. |
| `git diff --check` | **Passed**, no whitespace errors. |
| Production-preview HTTP check | `/`, `/experience`, and `/terminal` returned HTTP 200 and the new graphite app shell; `/resume.pdf` and `/favicon.svg` also returned HTTP 200. |
| Local dev source check | `/experience` served the new `graphite-world` shell and no longer imports the legacy homepage. This confirms the active server picked up the new frontend source; it does not prove visual Canvas rendering. |
| Owner browser check | **Fallback reproduced.** The owner reported “WebGL context creation failed: the browser could not initialize the 3D renderer.” This verifies that capability detection sees WebGL APIs but R3F cannot initialize its Canvas in the tested browser. The report did not include expanded development details or console output, so the browser's native `statusMessage` and precise platform cause are not yet known. |
| Automated browser visual check | **Not completed.** Safari WebDriver is installed, but rejected session creation because “Allow remote automation” is disabled in Safari Settings. No browser settings were changed and no browser session/screenshot was created; the rendered WebGL scene remains unverified in this session. |

The build emitted the existing informational Browserslist `caniuse-lite` age warning. No dependency updates were made.

## Browser check for the owner

1. In your browser, hard-reload `http://127.0.0.1:8080/experience` to ensure the latest development diagnostics are loaded.
2. If the scene loads, confirm the entrance/corridor is visible and check the console for `[experience] WebGL 1/2 Canvas initialized successfully.`
3. If the readable portfolio appears, read the bold fallback reason. In development, expand **Development diagnostic details** and inspect the matching `[experience]` console entry. This distinguishes unsupported APIs, context creation failure, Canvas initialization, and scene rendering errors.
4. If the fallback remains, expand **Development diagnostic details** and send the full text shown there plus the browser name/version. In particular, the `WebGL context creation event statusMessage` distinguishes a browser-provided failure reason. Also send the `[experience] WebGL context creation failed` console entry. If the Canvas initializes but the scene is blank, send the first WebGL/Three.js console error instead.

The actual visual render is still unverified until this browser check is completed. No Phase 3 work or deployment was performed.
