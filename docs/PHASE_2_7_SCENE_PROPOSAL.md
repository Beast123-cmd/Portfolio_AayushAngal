# Living Sketchbook — Feasibility and Scene Composition Proposal

**Status:** proposal for visual and technical approval. No application code was changed for this proposal.

## Recommendation

Build the next prototype as a **navigable 2.5D sketchbook world** inside the existing single React Three Fiber Canvas. The camera will travel through actual 3D space along a guided path above an open sketchbook. Most of the finely drawn architecture, foliage, tools, and paper detail will be separate original illustrated layers placed at different depths. Bridges, page terrain, building silhouettes, doors, and a small number of recognizable mechanical props will be real lightweight geometry.

This keeps camera parallax and building interaction real. It avoids trying to model every pencil stroke as geometry or using one static image with a zoom effect. The existing Engineering Lab can remain the only destination with an interior in the next prototype; the other locations will be recognizable exterior stops with accessible HTML content.

## Proposed scene composition

### Opening overview

The visitor sees a large open sketchbook on a drawing desk from an elevated three-quarter angle. The sketchbook fills most of the viewport and acts as the land surface. A clear central route crosses the two pages and connects four visibly different landmarks. The destination skyline and route are composed so all four stops can be located from the overview without making them look like repeated doors.

| Destination | Silhouette and landmark | Prototype interior |
|---|---|---|
| Engineering Workshop | Broad pitched roof, open work bay, visible blueprint rolls, circuit schematic, mechanical arm, and measuring instruments | Yes: one camera approach/entry, reusing the existing Engineering Lab content and accessible project details where practical |
| The Journey | A winding miniature railway or marked footpath, a small station/waypoint marker, and milestones along the route | No; exterior stop and DOM content only |
| Art Studio | Taller windows, easel silhouettes, and empty framed display areas sized for the user's drawings later | No; exterior stop and DOM content only |
| Post Office | Distinct compact building, arched entry, mail slot, mailbox, and letter/package forms | No; exterior stop and DOM content only |

The bridge/path should connect these landmarks visibly. Modest overlaps between near and far layers create a reveal as the camera moves: details can sit behind a page fold, bridge support, roof edge, or tree silhouette. This gives the visitor reasons to move without hiding the route or making navigation a puzzle.

## What is geometry and what is illustration

### Actual 3D geometry

- Open-book base, page thickness, center seam, and shallow page surface.
- Walkable bridge/rail/path sections and a small amount of terrain relief.
- Building masses and roof profiles that define each destination's silhouette.
- Workshop mechanical arm, instruments, and large blueprint roll as simple low-poly forms.
- Studio easels/frames and Post Office letter box/mail slot as simple clickable forms.
- Doorway or workshop portal used for the one close-in transition.
- Original route markers and modest foreground props that need depth or pointer selection.

Geometry is reserved for forms that need parallax, a recognizable silhouette, collision-free approach, or direct pointer interaction. Fine pencil strokes will not be extruded into thousands of meshes.

### Layered illustrated assets

- Page-level graphite wash and subtle paper texture.
- Distant horizon, hills, roof tile marks, windows, shelves, tools, foliage, and background architecture.
- Dense cross-hatching, construction lines, shadows, diagrams, and small environmental marks.
- Replaceable empty artwork inside the Art Studio frames until the user supplies/picks drawings for publication.

These illustrations will be original, locally authored SVG or raster layers. They will be split by depth and scene function rather than flattened into a full-screen background. For WebGL texture maps, use tested raster exports (for example, transparent WebP/PNG) or only filter-free SVGs after validating their upload in Chrome. The previous corridor produced `texSubImage2D: bad image data`/immutable-texture warnings while sampling SVG textures; avoid SVG filter primitives such as `feTurbulence` in GPU texture inputs. Paper grain can remain a lightweight CSS overlay when it does not need to move in scene space.

The supplied art references and the generated mockup remain composition/style references. Neither is to be shipped as a single scene image or reused as a trace/template. All scene illustrations and shapes will be newly authored. User artwork remains a later, explicit asset-selection step.

## Camera and continuous movement

The overview camera follows a 3D Catmull–Rom or cubic-Bezier route over the book, with a camera position and look target at each curve parameter. It does not merely change `camera.zoom` or scale a background. A route progress value `p` in `[0, 1]` samples the camera position and orientation along that spatial path; depth-separated illustration layers then move at different parallax rates because they occupy different world positions.

`CameraDirector` remains the only writer of camera transforms. It will own:

- `currentProgress` and `targetProgress` for world travel.
- Frame-delta-based smoothing toward the target.
- The camera pose sampled from the route curve.
- Temporary locks during stop/enter/return transitions.
- The saved route progress and look pose when entering the Workshop.

The current corridor-only `pose.z` walk range is not sufficient for a branching sketchbook path. It should be replaced only after this proposal is approved with a camera-path model owned by that same director. The existing single Canvas, renderer, WebGL diagnostics/fallback, device DPR cap, and lazy room loading should remain.

## Scroll, building selection, and destination transitions

### Scroll and keyboard

- A non-passive `window` wheel listener, scoped to events inside the experience, handles mouse wheels and trackpads. This follows the useful input-routing pattern in the reference repository while keeping this implementation's own camera state and path.
- Normalize `deltaY` for pixel, line, and page modes. Add the normalized amount to a clamped target route progress. A frame-delta exponential or equivalent damping makes movement smooth across frame rates.
- Scrolling down advances along the bridge; scrolling up reverses toward the sketchbook's opening. Clamp at both ends so a visitor cannot move through the book or leave the designed route.
- Scroll from the opening view begins travel immediately; it must not require a prior “Enter” click. A very small hint can say “Scroll to travel.”
- W/ArrowUp and S/ArrowDown move along the guided route. A/D and ArrowLeft/ArrowRight either change the selected nearby destination consistently or adjust look, not both. For this prototype, keep them as destination selection to preserve the current accessible navigation behavior.
- On touch, vertical drag adjusts target route progress; destination buttons remain large, direct controls. Do not let browser page scrolling swallow the canvas gesture.

### Destination stops

- Pointer selection on each landmark eases the same camera director to that landmark's route waypoint.
- The compact HTML destination index selects the same waypoint, supports keyboard focus/activation, and remains available when pointer selection is unavailable.
- Selecting the Workshop and activating “Enter” moves the camera through its actual doorway/portal into the one prototype interior. Keep all project descriptions, technologies, and links as HTML.
- Store the overview route progress and camera pose before entry. “Return to world” restores that saved location without resetting the visitor to the beginning.
- The Journey, Art Studio, and Post Office stop at their exteriors in this prototype and expose their accessible HTML destination content. Their interiors remain out of scope.

### Reduced motion and fallback

With reduced motion enabled, wheel/keyboard input updates route progress directly and selection/room transitions snap to endpoints without camera tweening. WebGL failure retains the readable DOM destination list and simple graphite view. No essential route or project detail may exist only inside the canvas.

## Graphite rendering plan

1. Keep the warm ivory page as the default color field; use graphite as the primary line and shading color.
2. Separate structural contours, lighter construction strokes, cross-hatched shade groups, and soft smudge shapes into distinct depth/asset layers. Avoid evenly repeating one hatch stroke across every surface.
3. Use varied line weights and slightly offset echo strokes at a small number of structural edges; reserve dark, dense hatching for contact shadows, roof undersides, and occlusion points.
4. Render surfaces with matte, stable colors. Use original transparent illustration maps for the detailed pencil work rather than relying on dynamic shadows, a global toon shader, or full-screen postprocessing.
5. Keep color almost entirely absent in the overview. A destination can expose a small terracotta, cobalt, or sage accent only when selected/entered; the signal-path color reveal remains a separate interaction.
6. Make the paper and drawing carry the composition. UI should be limited to a small wordmark, compact four-stop index, one movement hint, and a discreet simple-view action. Project details remain readable in HTML when a stop is selected, not in four permanent floating panels.

## Small prototype scope

The next implementation should validate one continuous, spatial scene rather than build four room interiors:

1. An open sketchbook and original overview illustration with the four distinct exterior landmarks.
2. A real camera route over the page and bridge with forward/reverse wheel, trackpad, keyboard, touch, and direct waypoint selection.
3. One Workshop approach and entry, plus a return that restores the prior world position.
4. One discovery/reveal accent and one accessible project detail overlay using the canonical typed project data.
5. The compact navigation, reduced-motion behavior, WebGL fallback, and the existing single Canvas.

Not included: Journey, Studio, or Post Office interiors; full portfolio copy migration; complex collision/physics; full 3D reconstruction of the illustration; external asset packs; dynamic shadows; postprocessing; deployment.

## Feasibility and performance limits

This is feasible with the installed React, TypeScript, Three.js, R3F, Drei, and GSAP versions. No dependency addition is proposed. The main work is original art and camera choreography rather than a new rendering library.

Primary costs and controls:

- **Transparent-layer overdraw:** keep only a few large depth layers; avoid stacking many full-screen translucent textures.
- **Texture upload and memory:** use small, validated raster maps (start with 512–1024 px layers and one 2048 px hero atlas only if needed); load workshop-specific layers on entry; test assets in the user's Chrome before adding more.
- **Draw calls:** batch linework by depth/material and use atlas regions for repeated marks. Do not create a mesh per pencil stroke.
- **Mobile fill rate:** cap DPR using existing device tiers, reduce distant illustration layers and detail, and preserve the DOM fallback.
- **Camera/input conflict:** wheel only updates the camera director's target progress; GSAP or selection transitions take a lock and are the only temporary override. Do not let React components, input handlers, and R3F frame loops write camera transforms independently.

No runtime performance number can be promised before the prototype is measured. The first prototype should record bundle output, texture byte sizes, draw calls, and observed frame rate at overview and Workshop approach on desktop Chrome and one mobile-sized/low-tier profile. If layered transparency is too expensive, reduce layer count before reducing line quality across every asset.

## Validation gates before expanding the world

Approve the composition and prototype scope first. Then implement only this prototype and require the following before adding more rooms:

- The camera position visibly travels along the route in 3D; a browser recording or side-by-side screenshots at overview, bridge, and Workshop stop show parallax and changed perspective.
- Reversing wheel/trackpad input returns along the route; route bounds prevent leaving the book.
- Each of the four buildings is distinguishable in the overview and the HTML index selects the corresponding waypoint.
- The Workshop entry and return work without losing the saved overview position.
- Keyboard, touch destination controls, reduced motion, and WebGL fallback remain usable.
- Chrome console has no texture-upload errors for the chosen art assets; the prototype reports its actual Canvas initialization status.
- Build, lint, and TypeScript checks pass; one desktop and one mobile viewport are visually reviewed.

Only after those gates pass should the Journey, Art Studio, and Post Office interiors be planned as later work.

## Approval requested

Please approve or revise:

1. The open-book, elevated three-quarter world overview and connected bridge/route composition.
2. The one-interior prototype scope: Workshop only; the other three destinations remain exterior landmarks with DOM content.
3. The 2.5D split between lightweight interactive geometry and separately authored graphite illustration layers.

No app code, artwork asset, route, or dependency was modified while preparing this proposal.
