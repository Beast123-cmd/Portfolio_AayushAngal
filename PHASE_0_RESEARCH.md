# Phase 0 — Research and Architecture

**Status:** research only. No application files or dependencies have been changed. The reference repository was cloned for inspection to `/tmp/portfolio-itom-reference`, outside this project.

## Executive recommendation

Retain the current React + TypeScript + Vite application and add the immersive world as a new, lazy-loaded experience on the existing home route. Keep the existing data records, resume, terminal page, and contact capability as the content and fallback layer. This avoids a framework migration and preserves the existing Vercel static build. Use React Three Fiber for the 3D scene, GSAP for camera/door choreography, and HTML for all essential content and accessible navigation. Begin with a deliberately compact scene and custom, original low-poly geometry and illustrations; do not import the reference artwork or its asset tree.

## Current project architecture

- **Frontend:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3. `src/main.tsx` mounts `App.tsx`; `BrowserRouter` serves `/`, `/terminal`, and a not-found route. The home page currently composes `Navbar`, `Hero`, `About`, `Projects`, `Resume`, `Education`, `Certificates`, `Contact`, and `Footer`.
- **Content and UI:** typed portfolio records live in `src/data/{projects,experience,skills}.ts`; images and current personal assets live in `src/assets/` and `public/`. The project includes many shadcn/Radix UI components, form validation (React Hook Form + Zod), Framer Motion, React Query, and an existing terminal page.
- **3D/animation readiness:** dependencies already include `three` 0.161, `@react-three/fiber` 8, `@react-three/drei` 9, GSAP 3, and Spline. R3F is not currently used by the home page. Keep this known working major-version set for the initial scene; do not copy the reference's R3F 9 / React 19 dependency upgrades wholesale.
- **Build/deploy:** Vite multi-entry build uses `index.html` and `terminal/index.html`, manual vendor/animation/Spline chunks, and a 1000 KB warning threshold. `vercel.json` builds `dist` and rewrites paths to `index.html`. There is no evidence in this configuration that the separate Express backend deploys with the static frontend.
- **Contact/backend:** `backend/` is a separate Express + MongoDB/Mongoose + Nodemailer service with contact and resume routes. Preserve its API behavior when connecting the new scene. Keep contact form as DOM, never as canvas-only UI.
- **Existing authored material:** current profile, project imagery, resume and certificates are the user's own portfolio material and can be reused as their content, subject to confirming their rights to embedded third-party logos/images before carrying those into new scene textures.

## Reference architecture reviewed

The inspected repository is a Vite React JavaScript application. `src/App.jsx` owns a full-screen R3F `<Canvas>`, wraps scene/audio/performance state in contexts, lazy-loads `Experience`, and layers DOM preloader, navigation, room overlays, and a screen-reader layer over the canvas. `Experience.jsx` composes entrance, corridor manager, room warmup, and teleport behavior. The corridor is split into reusable segments and room-specific modules (About, Gallery, Studio, Contact). The reference README describes asynchronous shader warmup, adaptive device tiers, baked lighting, and semantic DOM content alongside the canvas.

Mechanisms found in source:

- **Corridor:** `InfiniteCorridorManager` maps camera Z to a segment index, keeps a small previous/current/next window mounted, and hides segments outside view. `CorridorSegment` composes geometry, doors, and decoration.
- **Camera/navigation:** `useInfiniteCamera` uses a `useFrame` loop to ease target camera position, accepts wheel and keyboard movement, tracks mouse parallax, and includes touch gestures. Door-triggered animation takes camera control while ordinary movement is disabled.
- **Doors and rooms:** door components use R3F pointer events and GSAP for door/camera choreography. Scene context represents current room and transitions; a separate DOM navigation/map offers room shortcuts and exit controls. The reference also supports URL room deep links.
- **Sketch/color rendering:** sketch and colored versions are separate texture maps. Shader modules (`RevealMaterial`, `RevealBasicMaterial`, `PaintRevealMaterial`, and Gallery `usePaintMaterial`) provide reveal/paint transitions. GSAP updates shader uniforms. Sketch-drawn imagery itself is texture content, distinct from the code that reveals it.
- **Asset/performance:** an explicit texture preload list is device-filtered. Room warmup compiles materials before entry; image assets are preloaded separately. Performance context selects DPR, antialiasing, shadows and power preference, and `PerformanceMonitor` downgrades after frame-rate decline. Segments are culled/hidden. The README describes baked lighting to avoid dynamic shadow cost.
- **Accessibility/mobile:** there is HTML navigation and room descriptions, screen-reader content, keyboard corridor controls, touch paths, reduced device texture loads, and visual transitions. The README nonetheless calls out hardware acceleration as a requirement, so a true no-WebGL fallback remains important for our own implementation.

## Component comparison

| Concern | Current portfolio | Reference pattern | Proposed adaptation |
|---|---|---|---|
| App shell | React Router; conventional stacked sections | Full-screen Canvas plus overlaid DOM | Keep Router and Vite shell; `/` loads an experience shell with a semantic DOM layer; retain `/terminal` |
| Scene organization | No R3F scene in active page | `Experience` composes entrance, corridor, rooms | Typed scene components grouped by environment and room; keep scene-state orchestration separate |
| Navigation | Scroll, navbar links, terminal action | Corridor movement, clickable doors, map/teleport | Keyboard/mouse/touch corridor plus always-visible room menu and direct room selection |
| Content | Typed project/experience/skill data | Room content and some Sanity-driven data | Bind the user's data records to room interfaces; keep data independent of meshes |
| Motion | Framer Motion | GSAP and R3F frame loop | GSAP only for bounded transitions; R3F `useFrame` for small continuous motion; avoid overlapping camera owners |
| Accessibility | Semantic React sections/forms | Canvas paired with hidden/accessibility DOM | First-class visible semantic route and controls, canvas optional enhancement, explicit fallback |
| Hosting | Vite static output on Vercel plus separately documented backend | Vite and asset/CDN/CMS code | Retain current Vercel build and evaluate asset size/API origin before launch |

## Proposed original experience

1. **Interactive entrance:** A custom illustrated workshop threshold establishes the world. A clear “Enter” button and “Skip immersive view” control work without pointer precision. Initial scene uses a static painted/line-art background while 3D loads.
2. **Engineering corridor:** A short modular corridor with four clearly labeled door destinations. Movement is bounded/waypoint-based, rather than an unbounded maze. Every door also appears as a DOM navigation link; a persistent map/room menu allows direct jumps.
3. **Projects laboratory:** Project exhibits are workbench screens, circuit boards, or paper schematics that display project title, stack, role, concise impact, and links. Use `src/data/projects.ts` as canonical content. Private repository visibility must remain respected.
4. **Experience room:** A timeline / lab wall for internships, education, and certificates backed by `experience.ts` and the existing resume/certificate files. Keep chronological content readable as HTML.
5. **Personal studio:** Original objects and drawings representing the user's interests and personal artwork; content should be authored/approved by the user and should not imitate the reference's character designs or room composition.
6. **Contact room:** Original communications console visual, with the current validated form and social/contact links rendered in HTML. Contact is reachable directly even if WebGL is unavailable.

## Proposed folder structure

```text
src/
  app/                    # app providers, route-level experience shell
  components/
    experience/           # ExperienceShell, scene state, overlay navigation
    scene/
      CanvasRoot.tsx      # renderer config, adaptive quality, scene boundary
      entrance/           # EntranceWorld, entrance interaction
      corridor/           # CorridorSegment, Door, corridor movement
      rooms/
        projects/          # ProjectsLab, project exhibit components
        experience/        # ExperienceRoom, timeline exhibits
        studio/            # PersonalStudio, authored artwork objects
        contact/           # ContactRoom (visual shell only)
      materials/           # small, independently testable shader materials
    fallback/              # semantic non-WebGL portfolio route/view
  data/                    # reuse typed project/experience/skills content
  hooks/                   # device capability, reduced motion, scene loading
  styles/                  # experience layout and overlay styles
  assets/
    world/                 # original optimized textures and illustrations
    models/                # original glTF only if modeling justifies it
```

The scene state should be a small typed state machine (`entrance`, `corridor`, `transitioning`, and one of the four rooms), with a single camera controller and transition coordinator. Do not allow a R3F frame loop, scroll handler, and GSAP tween to write camera transforms simultaneously. Route-level room IDs can later support browser history/deep linking without making Three.js own routing.

## Dependencies

### Keep initially

- `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`: already installed and directly useful. Use the current compatible majors initially (Three 0.161 / R3F 8 / Drei 9 / React 18).
- `react-router-dom`, `framer-motion`, Tailwind, Radix/shadcn, React Hook Form, Zod: retain for route shell, accessible DOM UI, and existing forms. Prefer GSAP for 3D camera/door timelines; avoid animating the same values with both GSAP and Framer Motion.

### Add only when a concrete need exists

- `@react-three/postprocessing` only if a restrained effect materially improves the chosen original style; default to no full-screen postprocessing.
- `@react-three/rapier` only if physics is genuinely needed; doors and props can be simple pointer interactions.
- A model pipeline/exporter is a creation tool, not a runtime dependency. Prefer authored geometry and lightweight GLB over expensive dynamic modeling at runtime.

Before implementation, check current peer dependency compatibility and bundle output. Do not upgrade React/Vite/R3F simply to match the reference's newer versions.

## Asset creation and rights strategy

- Draw a distinct visual language for this portfolio: fresh linework, palette, typography, silhouettes, prop designs, room layout, and textures. Build in SVG/2D paint tools, then map original optimized textures to simple geometry; use Blender/GLB only when it earns its cost.
- Treat reference **code** and reference **media** separately. The repo's MIT license allows code reuse subject to preserving its copyright/license notice. The repo README specifically says personal assets, textures, images, and copywriting are copyright Tomasz Szmajda and require permission. Do not copy any artwork, personal assets, branding, text, sounds, fonts without checking their specific license, or downloaded models.
- If a small reusable code section is copied/adapted, keep its MIT notice with that code and record source URL/file in a third-party notice. Prefer reimplementing the architectural pattern in TypeScript to make ownership and maintenance clearer. Do not copy a whole room or visual layout just because the code is MIT.
- For any external asset used later, record creator, source URL, license, attribution requirement, and modification. Use only assets with a clearly compatible license or explicit permission. Inspect license files for fonts and sounds individually; a repository-wide MIT label does not establish rights to every bundled asset.
- Existing project screenshots and user's own diagrams may be used after confirming they can be published. Never expose private data, credentials, unpublished repository details, or other people’s identifiable material in scene textures.

## Performance strategy

- Make the first meaningful paint and all essential content DOM-based. Load the Canvas asynchronously after initial shell content; use a useful 2D fallback when WebGL creation fails.
- Keep one renderer/canvas; cap DPR (initially 1–1.5 based on capability), avoid expensive realtime shadows, and target a modest triangle/draw-call budget. Use baked lighting and simple materials.
- Start with three visible corridor segments at most and dispose/unmount distant room assets. Avoid rendering all rooms offscreen solely to warm shaders; warm only required materials and evaluate memory on mobile.
- Texture budget: small compressed WebP/AVIF for color maps, KTX2/Basis only if tooling and browser compatibility justify it. Size texture dimensions to on-screen use; use atlases for repeated marks; avoid loading full-res art before its room is entered.
- Use `IntersectionObserver`/explicit scene state to load room-specific assets on demand, show progress, and cache carefully. Avoid a preload-all strategy on phones.
- Pause/reduce ambient animation when document is hidden; honor `prefers-reduced-motion`; offer a quality toggle or simple mode. Handle context loss and resize.
- Measure on real mobile hardware; monitor JS transfer, largest texture, GPU memory, frame time, and route startup. Split the 3D code into a lazy chunk, but ensure Vercel asset paths and multi-entry behavior remain correct.

## Accessibility and browser requirements

- Pair every 3D affordance with visible semantic HTML: named room links/buttons, focus state, keyboard operation, skip controls, and a route/menu that never requires spatial discovery.
- Keep project descriptions, work history, contact fields, resume links, and outbound links in the DOM with headings and logical reading order. Use correct labels, validation announcements, and status/error messages.
- Keyboard mappings must not hijack typing, preserve normal page scroll outside the active scene, and expose a way to exit a room. Provide touch controls with large targets and non-hover equivalents.
- Honor reduced motion; do not make camera movement the only way to read content. Ensure sufficient contrast and avoid color-only state cues. Make canvas decorative to assistive tech when equivalent content exists; otherwise label it and keep equivalent DOM content adjacent.
- WebGL2 availability and GPU performance vary across browser/device; Safari/iOS can be memory constrained, and low-end Android may have weak GPU/texture capacity. Test Chrome, Firefox, Safari macOS, Safari iOS, and Android Chrome. Provide non-WebGL fallback for browser setting restrictions, context loss, and unsupported graphics.

## Technical risks and mitigations

| Risk | Mitigation |
|---|---|
| Large initial download / slow shader compilation | Lazy-load Canvas, defer room assets, cap texture sizes, compile only essential materials, use progressive visual states |
| GPU memory exhaustion on phones | Device quality tiers, limited mounted geometry/textures, no full-res all-room preloads, context-loss recovery and DOM fallback |
| Camera controls conflict with transition tweens | One camera owner/coordinator; explicit transition state disables movement; cancel/kill prior tweens on state change |
| Portfolio content becomes inaccessible or hard to navigate | DOM mirrors every room/content item; direct links and keyboard control; simple page view option |
| WebGL or asset loading failure blocks entire portfolio | HTML fallback is the actual content source; canvas is enhancement; failure boundary and retry/simple view |
| Current deployment rewrite masks routes / backend is separate | Preserve existing entry points; verify Vercel rewrites and API CORS/base URL before release; don't assume backend is hosted with static frontend |
| MIT code mistaken for permission to reuse bundled media | Keep copied code notices; audit media and font licenses independently; create original illustrations and sounds |
| Concurrent animation libraries produce jank | Restrict GSAP to transitions, `useFrame` to small continuous values, React state to discrete state changes |
| Hidden DOM SEO/accessibility diverges from scene | Use shared typed data as source of truth and render both visual and semantic representation from it |

## Implementation phases after architecture approval

1. **Foundation and fallback:** route shell, semantic 2D portfolio, scene-state model, reduced-motion/device capability hooks, WebGL capability/failure handling.
2. **Entrance and navigation prototype:** original entrance illustration, compact corridor, accessible room menu, click/keyboard/touch movement. Validate the visual direction before building all rooms.
3. **Projects laboratory:** build one complete room from typed project records and test interaction/content hierarchy.
4. **Experience and personal studio:** add internship/education/certificate displays and user-authored art/interest content.
5. **Contact and integration:** connect accessible form to current API contract, preserve resume/terminal links and add graceful API errors.
6. **Optimization and compatibility:** asset audit/compression, device quality tiers, reduced-motion pass, browser/mobile and accessibility review, verify existing Vercel multi-entry deployment.

No implementation phase has started. Phase 1 begins only after the architecture is approved.

## Inspection references

- Live visual reference: [itomdev.com](https://itomdev.com/)
- Source: [ITomPoland/portfolio-itom](https://github.com/ITomPoland/portfolio-itom)
- License: [repository MIT LICENSE](https://github.com/ITomPoland/portfolio-itom/blob/main/LICENSE)
- Asset rights statement: [repository README, License section](https://github.com/ITomPoland/portfolio-itom#license)
- Relevant reference source paths inspected: `src/App.jsx`; `src/components/canvas/Experience.jsx`; `src/components/canvas/corridor/InfiniteCorridorManager.jsx`; `src/components/canvas/corridor/CorridorSegment.jsx`; `src/components/canvas/entrance/EntranceDoors.jsx`; `src/hooks/useInfiniteCamera.js`; `src/components/canvas/shaders/{RevealMaterial,RevealBasicMaterial,PaintRevealMaterial}.jsx`; `src/components/canvas/rooms/Gallery/usePaintMaterial.js`; `src/config/texturePreloadList.js`; `src/context/PerformanceContext.jsx`; `src/components/ui/{NavigationUI,ScreenReaderOverlay}.jsx`.
