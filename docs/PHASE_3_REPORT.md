# Phase 3 — Engineering Lab Report

## Summary

Implemented the first room as a graphite-on-warm-paper engineering workshop entered through the existing Engineering Lab doorway. The room contains three original, lightweight project exhibits, pinned technical line studies, and a central drafting bench. Its project register and detail panel remain in accessible HTML; selecting an exhibit also moves the scene camera through the existing camera director. No other room interior was added.

## Files changed

- `graphite-world/src/data/projects.ts` — copied the canonical typed project records into the active Graphite World application. The file was compared with the tracked source using `cmp` and is byte-identical; existing project data was not edited.
- `graphite-world/src/data/labProjectIds.ts` — defines the IDs and type guard for the three featured projects.
- `graphite-world/src/data/engineeringLab.ts` — filters the canonical records and provides editorial exhibit notes derived from their descriptions. It does not add independent links or metrics.
- `graphite-world/src/components/experience/EngineeringLab.tsx` — adds original room geometry, line-drawn wall sheets, the three project objects, a workbench, and interaction/reveal behavior.
- `graphite-world/src/components/experience/sceneState.ts` — adds project selection and the Engineering Lab screen to the existing reducer.
- `graphite-world/src/components/experience/WorkshopScene.tsx` — lazy-loads the Engineering Lab into the existing Canvas.
- `graphite-world/src/components/experience/CameraDirector.tsx` — adds centralized poses and transitions for the room and its exhibits.
- `graphite-world/src/components/experience/CanvasRoot.tsx` — passes exhibit selection through the existing scene boundary.
- `graphite-world/src/pages/ExperienceShell.tsx` — adds accessible exhibit navigation, project details, links, reveal and return controls, and keyboard selection.
- `graphite-world/src/styles/experience-shell.css` — styles the room detail panel and small-screen room layout.
- `PHASE_3_REPORT.md` — this report.

## Architecture and interactions

The app still uses one React Three Fiber Canvas. The scene reducer owns discrete navigation state, while `CameraDirector` remains the sole owner of camera movement and GSAP choreography. `EngineeringLab` is loaded with `React.lazy` when its doorway transition begins; the shared Canvas and renderer are not duplicated.

The Engineering Lab is assembled from original box geometry, line segments, simple materials, and two lights. It uses no downloaded models, texture packs, dynamic shadows, postprocessing, or new dependencies. Each of the three exhibits can be selected through its 3D object or sketch and through the semantic HTML exhibit register. Selection moves the camera to the corresponding waypoint and updates the HTML record. Keyboard left/right and A/D selection is also wired. The HTML “Return to corridor” control dispatches the existing scene-state action; the camera director then animates back to the corridor. “Reveal exhibit accents” changes the selected exhibit's graphite lines and object details to a muted project accent.

The detail panel displays the project name, problem, engineering approach, technologies, recorded outcome, contribution-data gap, original project summary, and links present in the source record. The typed records do not specify Aayush's individual contributions or measured outcomes. The UI explicitly says so instead of inventing either. Updating those records with verified contribution/outcome statements is a content follow-up for approval.

## Content source and links

The featured records are `medico-ai`, `researchsync`, and `elevra-ai`, selected from the existing typed project records. Project descriptions, tags, GitHub visibility, GitHub URLs, and demo URLs are read from those records. The summaries in `engineeringLab.ts` are interpretive copy based on the existing descriptions; they do not assert new metrics. The records include private GitHub repositories for MEDICO.AI and ResearchSync and the recorded GitHub/demo links for Elevra.ai. The implementation does not claim that the external demo is currently available.

## Performance impact

Production build output:

- Engineering Lab lazy chunk: **6.97 kB raw / 1.90 kB gzip**.
- `CanvasRoot` chunk: **163.86 kB raw / 53.50 kB gzip**.
- Three.js chunk: **671.00 kB raw / 172.78 kB gzip**.
- Build completed in **2.10 s** in this environment.

These are bundle measurements, not runtime FPS or memory measurements. Geometry and line studies are small and local; no large assets are downloaded. Existing renderer DPR limits and fallback behavior remain in place. The build emitted the existing stale `caniuse-lite`/Browserslist data warning; dependencies were not installed or upgraded.

## Verification performed

### Automated checks

- `npx tsc --noEmit -p tsconfig.app.json` — **passed** (exit 0).
- `npm run lint` from `graphite-world/` — **passed** (exit 0).
- `npm run build` from `graphite-world/` — **passed** (exit 0).
- Canonical project record comparison (`git show HEAD:src/data/projects.ts` against `graphite-world/src/data/projects.ts`) — **identical**.

### Browser observations

The existing local Chrome session at `http://127.0.0.1:8080/experience` rendered the corridor, then the Engineering Lab, and displayed the development status **“WebGL 2 Canvas initialized.”** A captured lab view showed the MEDICO.AI detail panel, wall studies, exhibit register, and room geometry. Keyboard-driven navigation was exercised: the selected project changed to Elevra.ai and the camera moved to its exhibit. A screenshot of the lab was captured during the session at `/tmp/phase3-room-final.png`.

These observations establish Canvas initialization and that the room scene and keyboard exhibit selection render in this browser session. They do not establish all interaction paths or behavior on other devices.

### Not directly verified

- Returning from the room and confirming the complete animated return in the browser.
- Pointer selection of a 3D project object or wall study.
- Activating every GitHub/demo link (links were rendered in the detail panel; external destinations were not opened).
- The exhibit accent reveal and restoration in the browser.
- `prefers-reduced-motion` behavior in a browser session.
- A mobile viewport and touch input.
- The WebGL-disabled fallback in a browser with WebGL disabled.
- Direct refresh/deep-link behavior for `/`, `/terminal`, and `/experience` as a route verification pass.

## Remaining issues and Phase 3 readiness

The room prototype is implemented and its production build, type check, lint check, WebGL initialization, room rendering, and keyboard-based exhibit selection are verified. Several requested browser interactions and responsive/fallback cases remain unverified, so they should be checked during visual review before treating Phase 3 acceptance as complete. The project content also needs user-approved contribution and outcome details if those are to be shown as first-person achievements.

No deployment, merge, Phase 4 work, additional room interior, contact backend change, dependency addition, or dependency installation was performed.
