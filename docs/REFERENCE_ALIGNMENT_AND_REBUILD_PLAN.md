# Reference Alignment and Rebuild Plan

**Status:** Audit prepared; no application code changed for this audit.
**Visual direction:** Original immersive graphite corridor, as specified in the current master goal. The Living Sketchbook village direction is superseded.
**First implementation milestone:** One short, richly illustrated, scroll-navigable corridor segment with one working interactive doorway.

## Evidence labels

- **Verified** means directly observed in the current workspace, reference repository, reference website, or the linked technical article.
- **Reported** means recorded in prior project reports or the user's browser feedback; it was not independently reproduced during this audit.
- **To verify** means runtime or production behavior that needs a browser session or deployment inspection.

## 1. Current implementation assessment

### Workspace and application wiring

- **Verified:** The root Vite configuration points `publicDir` and the `@` alias at `graphite-world/public` and `graphite-world/src`. The root `index.html` loads `/graphite-world/src/main.tsx`. That directory is therefore the active frontend in this checkout.
- **Verified:** The former root `src/` tree is currently marked deleted in `git status`, while `graphite-world/` is untracked. The original portfolio components and typed data are not present at the former `src/` paths in the current working tree. This is a material preservation risk that must be resolved deliberately before a rebuild; this audit does not restore, discard, stage, or commit anything.
- **Verified:** `graphite-world/src/main.tsx` currently uses a catch-all route for `ExperienceShell`. Existing route-specific behavior for `/`, `/terminal`, and `/experience` is not represented in this new entry point. Prior reports describe these routes as preserved, but the present route wiring should be reconciled before implementation.
- **Verified:** `graphite-world/src/` contains a small set of typed project/Engineering Lab records, a Graphite fallback, one corridor scene, and one Engineering Lab scene. The current root `package.json` still provides React 18, TypeScript 5.8, Vite 5, Three.js 0.161, R3F 8, Drei 9 and GSAP 3. No dependency change is proposed.
- **Verified:** The root `backend/` directory remains separate. The active frontend currently exposes a résumé PDF in `graphite-world/public/`; presence in the tree does not establish production route or contact API behavior.

### Scene and interaction state

- **Verified:** `CameraDirector.tsx` is the single camera writer in the active scene. It provides bounded Z movement, keyboard-held walking, look input, GSAP waypoint transitions and a transition lock. `sceneState.ts` owns entrance/corridor/transition/Engineering Lab/simple-view state.
- **Verified:** `ExperienceShell.tsx` normalizes wheel units and sends wheel impulses to `CameraDirector.walkBy()`. It prevents page scrolling only when the event target is inside the experience, and only in entrance/corridor states. Earlier user feedback says scroll still did not work; that is **reported**, not reproduced by this source audit. The next prototype must measure and demonstrate actual camera displacement from wheel and trackpad input in the browser instead of treating a handler or build as proof.
- **Verified:** Keyboard W/Up and S/Down drive corridor movement; A/D and left/right select destinations. Pointer drag controls looking. A touch-device summary is displayed, but the inspected code does not establish vertical touch travel; touch travel is **to verify**.
- **Verified:** The scene has four labeled door frames, but only the Engineering Lab door opens into a room state. That room contains project exhibits. The other destinations do not have differentiated environments in the active scene. The present corridor is finite and small, with box-based doors, two batched line geometries, and algorithmically repeated hatching.
- **Verified:** The only local world image assets are small SVGs for paper grain and a signal-path exhibit. The corridor's pencil character mainly comes from flat warm materials, outlines, and procedural line marks rather than authored, detailed architectural texture maps. This explains the visual gap between “graphite pencil illustration” and the current prototype; it does not establish that textures alone will solve composition.
- **Verified:** The active frontend has an accessible HTML destination menu and an HTML fallback. The details of the Canvas diagnostics and browser-based minimal test exist in `ExperienceShell`/`CanvasRoot`; prior WebGL reports document fixes, but no fresh WebGL runtime test was run in this audit.

### Current gaps relative to the current master goal

1. The visual scene is still a simple corridor prototype rather than a lived-in architectural drawing with authored texture detail, layered illustration, and distinct door identity.
2. The previous proposal's open-book, bridge, Journey station, village-like exterior landmarks are now out of direction. They must not become production geometry or assets.
3. The scene's multiple destinations and one prototype room do not yet meet the newly stated first milestone, which focuses on a short corridor segment and one working doorway as the first visually validated implementation.
4. Wheel code exists, but the reported non-working scroll is unresolved until observed in the local browser. The initial corridor acceptance gate must explicitly prove camera motion and reversal.
5. Original root portfolio source is absent from the working tree while files are marked deleted. Project data, routes, résumé, and contact behavior need a documented preservation inventory before replacing or reintroducing the application shell.
6. No browser screenshots or measured FPS/texture memory from this audit are claimed.

## 2. Reference architecture findings

Sources reviewed:

- [ITom portfolio](https://itomdev.com/)
- [ITom open-source repository](https://github.com/ITomPoland/portfolio-itom)
- [Codrops technical case study](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/)

### Verified findings

- The Codrops article describes the visual foundation as simple flat geometry with hand-drawn textures, rather than a conventional modeled environment. It specifically says paper backgrounds, ink-line doors, and corridor doodles are composed as intentional assets. The effect depends on authored surface artwork and scene placement, not only on geometry outlines.
- The reference source uses one R3F `<Canvas>` around the lazy-loaded `Experience`. Scene context and a separate DOM navigation/overlay system sit around that canvas. The source also uses a preloader and room warm-up path.
- The corridor manager maintains the camera's current segment plus adjacent segments and hides out-of-view geometry. This is a chunked corridor system; the article explains that it mounts three segments at a time and uses visibility checks to avoid drawing distant segments.
- `useInfiniteCamera.js` routes wheel input, keyboard travel, mouse parallax, touch drag, optional device orientation, door auto-glance, and a camera override mode through a camera hook. Its current source uses GSAP Observer for unified wheel/touch/pointer events and a frame loop for smoothing.
- `DoorSection.jsx` treats a doorway as more than a clickable panel: it tracks proximity and hover state, animates door/handle and camera, records camera position/rotation before entering, and restores a corridor view on exit. `Experience.jsx` disables ordinary scroll/parallax while teleporting or inside a room to avoid competing camera writes.
- The source's reveal material extends a Three.js material and blends sketch and painted textures using a shader uniform and a noisy mask. The Codrops article describes the reveal as a visual affordance for interactivity.
- The repository README describes adaptive performance tiers, DPR/antialiasing choices, and precompilation. The actual `App.jsx` configures canvas/context attributes and preloading; those are implementation choices to study, not settings to copy uncritically.
- The reference repository declares MIT licensing for its code. Its README explicitly excludes the author's personal artwork, textures, images, and copywriting from the code license. Any code reuse must retain the license notice and attribution; this project should create its own visual assets and wording.

### Important cautions

- “Infinite corridor,” large texture preloads, warm-up of every room, audio systems, analytics, achievements, and other reference subsystems are not requirements for this portfolio. The first corridor should be finite and small, with measured loading/performance before any chunking or shader-precompile system is adopted.
- The reference source is a technical reference, not a design kit. Do not reproduce its exact door drawings, room arrangements, texture sheets, props, copy, branding, or personal material.
- The website and GitHub source can change. The findings above describe the sources reviewed during this audit, not an assertion that every behavior was independently exercised in a browser today.

## 3. Visual differences and missing interactions

| Area | Current implementation | Reference principle | Rebuild target |
|---|---|---|---|
| Overall composition | Finite, mostly empty corridor with four similar box door frames | Scene authored from illustrated surface assets, props, and clear depth | A short, composed corridor with one visually distinctive working doorway and authored original graphite textures |
| Materials | Warm flat meshes, outline edges, limited SVG exhibit art, repeated procedural hatch lines | Pencil texture artwork mapped to planes/geometry, separate sketch and painted treatments | Purpose-authored texture maps on lightweight planes/geometry; line weights, shaded regions, and construction marks designed as a coherent set |
| Spatial depth | Simple corridor perspective | Corridor sections, objects, camera parallax, doorway alignment | Perspective-correct walls/floor/ceiling, layered depth, a restrained parallax response, and a bounded route |
| Navigation | Wheel impulse code exists; user reports it does not move; keyboard walking and door buttons exist | Smoothed wheel/touch travel, keyboard, subtle parallax and auto-glance | Reliable wheel/trackpad forward and reverse, keyboard/touch equivalents, bounded movement; confirm with visible camera displacement |
| Door behavior | Select any label; one Engineering Lab opening transition | Proximity/hover/focus affordance, opening choreography, camera alignment and saved return | One doorway with pointer, focus, keyboard and touch activation, approach/open animation, saved camera pose and return |
| Color reveal | One signal-path exhibit has a reveal option | Sketch-to-color indicates an active object | Preserve one small semantic color reveal, default graphite; avoid coloring the whole corridor |
| Content/UI | Persistent large intro/control areas with semantic navigation | Canvas is visual focus, navigation/content remains in DOM | Minimal overlay controls and clear shortcuts; preserve readable semantic content and fallback |
| Performance | One scene and simple geometry; no measured GPU/browser metrics in this audit | Quality tiers, preloading, segment visibility and adaptive render settings | Begin with one canvas and one segment, lazy textures, DPR cap, no dynamic shadows/postprocessing; profile before adding optimizations |

The current vs. reference visual comparison is based on current scene source, earlier Phase 2 reports, and the user's prior browser feedback. A fresh side-by-side browser capture was not available during this audit.

## 4. Components worth preserving

- **Camera ownership:** Retain the single-owner invariant represented by `CameraDirector`. It should remain the only code that writes camera transforms; input handlers update targets, and GSAP transitions acquire a lock/override through the director.
- **Reducer-driven scene state:** Retain the typed state/reducer concept for entrance, corridor, transition, room, and simple-view states. Reconcile state names with the intended room IDs without duplicating camera state in React.
- **One lazy Canvas:** Preserve the current R3F canvas boundary, DPR cap, context-loss handling, error boundary, and readable fallback, after confirming route behavior.
- **HTML-first content and shortcuts:** Preserve the semantic destination list, project/experience data display, résumé link, keyboard focus behavior, and simple-view fallback. Essential content must not exist only in WebGL.
- **Existing stack:** Keep React 18, TypeScript, Vite, Three.js, R3F, Drei, and GSAP already in the lockfile. No package addition or wholesale upgrade is proposed.
- **Existing content and services:** Inventory and retain verified project/experience facts, résumé, contact flow, `/terminal`, and backend contract. Because the original root `src/` is currently missing from the checkout, this requires a deliberate recovery/reconciliation step before any broad rebuild.
- **Useful current scene elements:** Reuse camera transition state and the basic selected-door model where it reduces risk, but rebuild corridor visuals and movement only after the first visual prototype proves the desired look and wheel behavior.

## 5. Components that require redesign or investigation

- Recompose the entrance and corridor around a strong first-person viewpoint and one distinct doorway. Do not continue the open-book miniature landscape.
- Replace repeated hatch marks and flat grey/warm boxes as the primary art treatment with authored original texture artwork: wall, floor, ceiling, door face, trim, and selected technical sketch surfaces.
- Redesign door construction and identity so labels and physical features are distinct, while maintaining readable DOM equivalents.
- Simplify persistent UI and make the Canvas dominant on supported devices without hiding fallback, résumé, or direct navigation.
- Rework navigation against evidence: one control owner, scoped wheel listener, normalized delta units, clamped target position, frame-delta smoothing, and tests for actual camera displacement. Determine why the current user-visible scroll is ineffective before replacing it.
- Audit active routes and portfolio-data recovery. The current catch-all router and missing root `src/` conflict with the previously documented route preservation; inspect Git history/branch state and recover approved content before migration.
- Keep Engineering Lab as the eventual project room, but do not add its full interior to the first corridor milestone. The first milestone is one working doorway, with a compact, factual destination landing or simple room placeholder only as needed to prove entry/return.

## 6. Original texture and asset production strategy

1. **Create an original asset brief and visual sheet.** Define paper tone, graphite values, stroke families, shading density, and the one selective accent. Draw the corridor assets from original perspective sketches; do not trace ITom screenshots or reuse reference textures.
2. **Author modular surface assets.** At minimum: paper grain; wall field with sparse construction lines and localized hatching; floor perspective/shadow map; ceiling board/beam map; a distinctive door sketch; door frame/hinge details; and one small technical exhibit. Keep labels as crisp HTML or carefully legible texture only where physically part of the drawing.
3. **Separate geometry from illustration.** Use simple perspective-correct planes/low-poly architectural geometry for wall/floor/ceiling/door movement. Map the authored linework to UV-consistent surfaces; put decals/technical notes on separate shallow planes where easier to control.
4. **Make sketch and color assets paired only where interaction warrants it.** The default map stays graphite. A small color map or restrained CSS/texture blend appears on selection/activation. Shader reveal remains optional until the base assets and Canvas are proven stable.
5. **Avoid fragile texture generation.** Use locally authored PNG/WebP textures or filter-free SVG only when validated in the target WebGL stack. Do not use SVG `feTurbulence`/filter chains as WebGL textures. Avoid building the whole image from repeated runtime hatch strokes.
6. **Keep assets small and load by scene.** Start with a compact texture atlas or a few 512–1024 px maps. Load corridor assets on entry; defer room-specific assets until the doorway is activated. Measure actual decoded/GPU memory before increasing resolution.
7. **Rights and authorship.** Maintain a source/license manifest for every asset. User's personal artwork can only be inserted when supplied and approved. Reference code adapted from the MIT repository must include license notice and attribution; reference art/media remain excluded.

## 7. Revised phase-by-phase implementation roadmap

### Gate 0 — Alignment audit (this document)

- Confirm the original corridor direction has replaced the Living Sketchbook direction.
- Record active workspace state, reference lessons, preservation risks, and test gates.
- No application changes in this gate.

### Gate 1 — Repository and content preservation

- Review current branch, Git status, and history to explain the root `src/` deletions and `graphite-world/` addition before changing files.
- Restore or deliberately migrate only the approved portfolio routes, typed content, résumé assets, and contact integration. Preserve `/`, `/terminal`, and the simple-view fallback.
- Verify route entries and identify a canonical data source for projects, experience, social links, and resume.
- Do not discard existing user changes or silently replace project facts.

### Gate 2 — Visual asset checkpoint

- Produce an original corridor composition preview plus modular wall/floor/ceiling/door/exhibit assets.
- Show a concise asset-to-geometry map and size/rights manifest.
- Wait for visual approval before building the new corridor scene.

### Gate 3 — First corridor prototype (first implementation milestone)

- Implement one short, bounded, richly illustrated corridor segment in the preserved React/Vite application.
- Use one R3F Canvas, existing `CameraDirector` ownership, current reducer/fallback, original mapped textures, one physical interactive doorway, and semantic DOM shortcuts.
- Prove forward and reverse wheel/trackpad camera movement plus keyboard and touch alternatives. Enter the one door and return to the exact saved corridor pose.
- Do not build all rooms or an infinite corridor.

### Gate 4 — Visual and technical review

- User review of the rendered scene at the start, mid-route, and doorway. Capture actual browser evidence.
- Run build, lint, and TypeScript checks; inspect console and texture uploads; measure bundle/asset bytes, draw calls, and desktop/mobile frame behavior.
- Correct composition and interaction defects before any room expansion.

### Gate 5 — Engineering Lab

- After first corridor acceptance, build the full Engineering Lab from the existing typed project data and approved original illustrations. Keep all detailed project content and links accessible in HTML.
- Verify project facts/links, entry/exit, reduced motion, keyboard and mobile behavior.

### Gate 6 — Journey, Art Studio, and Contact

- Add one room at a time after review. Use factual existing experience data; leave the Studio gallery empty until the user's actual drawings are supplied; preserve existing contact backend behavior.
- No invented artwork or unsupported project claims.

### Gate 7 — Release readiness

- Cross-browser, accessibility, route, fallback, performance, licensing, and deployment-host review.
- Deploy only after separate explicit approval.

## 8. Performance and storage considerations

- Keep one Canvas and the existing libraries. The active Three/R3F versions are older than the reference repository's stated stack, so copy patterns selectively and adapt them to installed APIs; do not upgrade simply for parity.
- Start with a single segment and a small texture set. Do not adopt infinite corridor chunking, all-room warm-up, or broad preloading until measurements demonstrate need.
- Keep DPR bounded (current capability hook already sets a tier-dependent cap), shadows disabled, and postprocessing absent for the first corridor.
- Avoid large transparent full-screen textures and excessive overlap. UV-map opaque wall/floor art where possible; use transparent decals sparingly.
- Lazy-load the scene and corridor textures; room content should mount only when entered. Keep HTML portfolio content available before GPU initialization completes.
- Record texture dimensions/bytes, production chunk sizes, renderer draw calls, and browser frame rate at desktop and mobile-sized viewports. Do not claim a target FPS without measurement.
- The shallow sparse reference checkout used for this audit is outside the project at `/tmp/portfolio-itom-audit`; it contains source for inspection only. No reference assets were copied into the project.

## 9. Acceptance criteria for the first corridor prototype

### Visual acceptance

- At the initial view, the visitor sees an immersive perspective corridor with warm paper surfaces, varied original pencil linework, real graphite shading/cross-hatching, and one visually distinct doorway.
- Surface treatment is primarily carried by purpose-authored illustrations mapped to lightweight geometry. Repeated procedural hatch lines alone do not pass.
- The door, wall, floor, and ceiling share a coherent pencil treatment; no broad flat-grey or black fill dominates the image.
- Interface controls remain compact and do not cover the corridor's focal area. Essential labels, navigation, résumé, and simple view remain usable in HTML.
- The scene is an original corridor environment, not an open-book village or a copy of reference composition/artwork.

### Interaction acceptance

- Wheel and trackpad scrolling visibly move the 3D camera forward and backward through a bounded route. Demonstrate with start/middle/end captures or a short recording, plus browser console evidence if input events are involved.
- Keyboard and touch controls produce equivalent travel and can activate the doorway without hover.
- Selecting/approaching the doorway gives a clear affordance. Door animation and camera transition do not fight over transforms.
- Entering the doorway and returning restores the saved camera position and orientation.
- Reduced motion removes or shortens camera animation while preserving direct navigation.
- The same destination and readable content remain available through keyboard-accessible HTML and the no-WebGL fallback.

### Technical acceptance

- Preserve `/`, `/terminal`, `/experience`, résumé access, existing data, and contact behavior; route refreshes work.
- One Canvas and one camera owner. No second WebGL context probe is active in ordinary mode; no context loss, shader, or texture-upload errors in browser console.
- No dependency was added without documented need. No postprocessing or dynamic shadows by default.
- Build, lint, and TypeScript checks complete successfully, with their actual results recorded.
- Browser testing includes a supported desktop browser and a mobile-sized viewport; build/HTTP status alone does not pass runtime interaction or visual acceptance.

## Audit conclusion

The current app has reusable interaction/state foundations, but it is not yet a convincing hand-drawn corridor. The immediate work should return to the original immersive corridor direction, recover/reconcile the missing root portfolio source and route/content preservation, and then validate original mapped graphite assets in a visual checkpoint. The first coded scene after approval should stay deliberately small: one corridor segment and one interactive doorway, with camera travel that is proven in the user's browser.

No application source, artwork, dependencies, or deployment configuration were modified while preparing this alignment plan.

## Repository consolidation update

The audit above is a historical snapshot from before Gate 1 preservation and the subsequent Graphite-only repository cleanup. The live app now uses `src/graphite/` as its sole immersive experience source; `graphite-world/` is no longer a separate app tree. The canonical portfolio data, résumé, contact flow, and `/terminal` utility remain preserved. `/` and `/experience` resolve to the Graphite experience. See `REPOSITORY_CLEANUP_REPORT.md` for current verification and file inventory. This update changes the roadmap's repository-status notes only; it does not authorize visual asset work or later phase implementation.
