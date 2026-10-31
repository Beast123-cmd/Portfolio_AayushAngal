import { lazy, Suspense, useCallback, useEffect, useReducer, useRef, useState, type ErrorInfo, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { ENGINEERING_LAB_PROJECT_IDS, type EngineeringLabProjectId } from "@/graphite/data/labProjectIds";
import { LAB_EXHIBIT_NOTES, LAB_PROJECTS } from "@/graphite/data/engineeringLab";
import { CanvasErrorBoundary } from "@/graphite/components/experience/CanvasErrorBoundary";
import type { CameraControlHandle } from "@/graphite/components/experience/cameraControls";
import { initialSceneState, ROOM_IDS, sceneReducer, type RoomId } from "@/graphite/components/experience/sceneState";
import type { RevealMethod } from "@/graphite/components/experience/SketchExhibit";
import { useDeviceCapabilities } from "@/graphite/hooks/useDeviceCapabilities";
import { useReducedMotion } from "@/graphite/hooks/useReducedMotion";
import GraphiteFallback from "@/graphite/pages/GraphiteFallback";
import "@/graphite/styles/experience-shell.css";
import "@/graphite/styles/world.css";

const CanvasRoot = lazy(() => import("@/graphite/components/experience/CanvasRoot"));

type FallbackReason = "webgl-unsupported" | "webgl-context-failed" | "canvas-initialization-error" | "scene-render-error";

interface RenderFailure {
  reason: Exclude<FallbackReason, "webgl-unsupported">;
  details: string;
}

type WebglProbe = {
  api: "webgl2" | "webgl";
  created: boolean;
  contextLost: boolean | null;
  message?: string;
  stack?: string;
};

async function runWebglProbe(api: WebglProbe["api"]): Promise<WebglProbe> {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  canvas.style.cssText = "position:fixed;left:-10000px;top:0;width:32px;height:32px";
  document.body.appendChild(canvas);
  let context: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  let loseContext: WEBGL_lose_context | null = null;

  try {
    context = api === "webgl2"
      ? canvas.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "default" })
      : canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "default" });
    if (!context) return { api, created: false, contextLost: null, message: "getContext returned null." };
    loseContext = context.getExtension("WEBGL_lose_context");
    if (!loseContext) {
      return { api, created: true, contextLost: null, message: "Context created, but WEBGL_lose_context is unavailable." };
    }

    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 500);
      canvas.addEventListener("webglcontextlost", () => {
        window.clearTimeout(timer);
        resolve();
      }, { once: true });
      loseContext?.loseContext();
    });
    return { api, created: true, contextLost: context.isContextLost() };
  } catch (error) {
    return {
      api,
      created: false,
      contextLost: context?.isContextLost() ?? null,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
  } finally {
    if (context && loseContext && !context.isContextLost()) loseContext.loseContext();
    canvas.remove();
  }
}

async function runNativeThreeProbe(): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  canvas.style.cssText = "position:fixed;left:-10000px;top:0;width:64px;height:64px";
  document.body.appendChild(canvas);
  let renderer: import("three").WebGLRenderer | null = null;
  try {
    const { WebGLRenderer } = await import("three");
    renderer = new WebGLRenderer({ canvas });
    const details = `Native Three.js renderer initialized. WebGL2=${renderer.capabilities.isWebGL2}; attributes=${JSON.stringify(renderer.getContext().getContextAttributes())}`;
    if (import.meta.env.DEV) console.info("[experience] Native Three.js comparison", details);
    return details;
  } catch (error) {
    const details = error instanceof Error ? `${error.message}\n${error.stack ?? "(no stack available)"}` : String(error);
    if (import.meta.env.DEV) console.error("[experience] Native Three.js comparison failed", error);
    return details;
  } finally {
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
    }
    canvas.remove();
  }
}

const ROOM_LABELS: Record<RoomId, string> = {
  projects: "01 · Engineering Lab",
  experience: "02 · The Journey",
  studio: "03 · Art Studio",
  contact: "04 · Connect",
};

const ROOM_NOTES: Record<RoomId, string> = {
  projects: "Engineering Lab: three project exhibits around a central drafting bench.",
  experience: "Doorway marker only in this visual prototype; no room interior is included.",
  studio: "Doorway marker only in this visual prototype; no room interior or placeholder artwork is included.",
  contact: "Doorway marker only in this visual prototype; contact details will be added in a later phase.",
};

export default function ExperienceShell() {
  const [scene, dispatch] = useReducer(sceneReducer, initialSceneState);
  const [renderFailure, setRenderFailure] = useState<RenderFailure | null>(null);
  const [canvasWebglVersion, setCanvasWebglVersion] = useState<number | null>(null);
  const [canvasMounted, setCanvasMounted] = useState(false);
  const [canvasMountCount, setCanvasMountCount] = useState(0);
  const [contextLost, setContextLost] = useState<boolean | null>(null);
  const [diagnosticException, setDiagnosticException] = useState("");
  const [webglProbes, setWebglProbes] = useState<Record<WebglProbe["api"], WebglProbe | null>>({ webgl2: null, webgl: null });
  const [probesComplete, setProbesComplete] = useState(false);
  const [nativeThreeResult, setNativeThreeResult] = useState("");
  const [nativeThreeRunning, setNativeThreeRunning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [revealMethod, setRevealMethod] = useState<RevealMethod>("dom");
  const capabilities = useDeviceCapabilities();
  const minimalTest = import.meta.env.DEV
    && new URLSearchParams(window.location.search).get("r3f-test") === "minimal";
  const reducedMotion = useReducedMotion();
  const showFallback = capabilities.webgl === false || renderFailure !== null;
  const controlRef = useRef<CameraControlHandle | null>(null);
  const dragRef = useRef<{ active: boolean; pointerId: number; x: number; y: number }>({
    active: false,
    pointerId: -1,
    x: 0,
    y: 0,
  });
  const queuedDoorRef = useRef<RoomId | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const experienceRootRef = useRef<HTMLElement | null>(null);
  const walkKeysRef = useRef(new Set<string>());
  const pendingWalkRef = useRef(0);

  useEffect(() => {
    if (!minimalTest) return;
    let cancelled = false;
    setProbesComplete(false);
    setWebglProbes({ webgl2: null, webgl: null });
    void (async () => {
      // Probe sequentially on separate canvases, release each context, then mount R3F.
      const webgl2 = await runWebglProbe("webgl2");
      if (cancelled) return;
      setWebglProbes((previous) => ({ ...previous, webgl2 }));
      if (import.meta.env.DEV) console.info("[experience] WebGL2 temporary-context probe", webgl2);
      const webgl = await runWebglProbe("webgl");
      if (cancelled) return;
      setWebglProbes((previous) => ({ ...previous, webgl }));
      if (import.meta.env.DEV) console.info("[experience] WebGL1 temporary-context probe", webgl);
      setProbesComplete(true);
    })();
    return () => { cancelled = true; };
  }, [minimalTest]);

  const onTransitionComplete = useCallback(() => {
    dispatch({ type: "transitionComplete" });
    const queuedWalk = pendingWalkRef.current;
    pendingWalkRef.current = 0;
    if (queuedWalk > 0) controlRef.current?.walkBy(queuedWalk);
    const queuedDoor = queuedDoorRef.current;
    queuedDoorRef.current = null;
    if (queuedDoor) dispatch({ type: "selectDoor", room: queuedDoor });
  }, []);
  const reportRenderFailure = useCallback((reason: RenderFailure["reason"], error: Error, info?: ErrorInfo) => {
    const details = [error.message, error.stack, info?.componentStack].filter(Boolean).join("\n\n");
    setDiagnosticException(details || "Exception was reported without a message or stack.");
    if (import.meta.env.DEV) console.error(`[experience] ${reason}`, error, info?.componentStack ?? "");
    setRenderFailure({ reason, details });
  }, []);
  const onWebglContextCreationError = useCallback((event: Event) => {
    const contextEvent = event as WebGLContextEvent;
    const details = [
      `WebGL context creation event statusMessage: ${contextEvent.statusMessage || "(not provided by browser)"}`,
      `Browser: ${navigator.userAgent}`,
      `WebGLRenderingContext: ${typeof window.WebGLRenderingContext}`,
      `WebGL2RenderingContext: ${typeof window.WebGL2RenderingContext}`,
      `Secure context: ${window.isSecureContext}`,
    ].join("\n");
    reportRenderFailure("webgl-context-failed", new Error(details));
  }, [reportRenderFailure]);
  const onRendererWindowError = useCallback((event: ErrorEvent) => {
    const message = event.error instanceof Error ? event.error.message : event.message;
    if (!/webgl|renderer|context/i.test(message)) return;
    reportRenderFailure("canvas-initialization-error", event.error instanceof Error ? event.error : new Error(message));
  }, [reportRenderFailure]);
  const onRendererRejection = useCallback((event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    if (!/webgl|renderer|context/i.test(message)) return;
    reportRenderFailure("canvas-initialization-error", reason instanceof Error ? reason : new Error(message));
  }, [reportRenderFailure]);
  const attachCanvasHost = useCallback((node: HTMLDivElement | null) => {
    const previous = canvasHostRef.current;
    if (previous) {
      previous.removeEventListener("webglcontextcreationerror", onWebglContextCreationError, true);
      window.removeEventListener("error", onRendererWindowError);
      window.removeEventListener("unhandledrejection", onRendererRejection);
    }
    canvasHostRef.current = node;
    if (node) {
      node.addEventListener("webglcontextcreationerror", onWebglContextCreationError, true);
      window.addEventListener("error", onRendererWindowError);
      window.addEventListener("unhandledrejection", onRendererRejection);
    }
  }, [onRendererRejection, onRendererWindowError, onWebglContextCreationError]);
  const onCanvasInitializationError = useCallback((error: Error, info: ErrorInfo) => {
    reportRenderFailure("canvas-initialization-error", error, info);
  }, [reportRenderFailure]);
  const onSceneError = useCallback((error: Error, info: ErrorInfo) => {
    reportRenderFailure("scene-render-error", error, info);
  }, [reportRenderFailure]);
  const onCanvasReady = useCallback((webglVersion: number) => {
    setCanvasWebglVersion(webglVersion);
    setContextLost(false);
    if (import.meta.env.DEV) console.info(`[experience] WebGL ${webglVersion} Canvas initialized successfully.`);
  }, []);

  const onCanvasMount = useCallback((mounted: boolean) => {
    setCanvasMounted(mounted);
    if (mounted) setCanvasMountCount((count) => count + 1);
  }, []);

  const onContextLost = useCallback((event: Event) => {
    const contextEvent = event as WebGLContextEvent;
    const details = `Canvas WebGL context lost. statusMessage=${contextEvent.statusMessage || "(not provided)"}`;
    setContextLost(true);
    setDiagnosticException(details);
    if (import.meta.env.DEV) console.error("[experience] WebGL context lost", details);
  }, []);

  const runNativeThreeComparison = useCallback(async () => {
    setNativeThreeRunning(true);
    setNativeThreeResult("");
    try {
      setNativeThreeResult(await runNativeThreeProbe());
    } finally {
      setNativeThreeRunning(false);
    }
  }, []);

  useEffect(() => {
    if (capabilities.webgl === false && import.meta.env.DEV) {
      console.error("[experience] WebGL unsupported", capabilities.webglReason);
    }
  }, [capabilities.webgl, capabilities.webglReason]);
  const toggleReveal = useCallback(() => setRevealed((value) => !value), []);

  const selectProject = useCallback((projectId: EngineeringLabProjectId) => {
    dispatch({ type: "selectProject", projectId });
  }, []);

  const selectDestination = (room: RoomId) => {
    if (scene.screen === "transitioning") return;
    if (scene.screen === "entrance") {
      queuedDoorRef.current = room;
      dispatch({ type: "enter" });
      return;
    }
    if (scene.screen === "simple") return;
    if (scene.screen === "projects") dispatch({ type: "returnToCorridor" });
    dispatch({ type: "selectDoor", room });
  };

  const openSelectedDoor = () => {
    if (scene.screen !== "corridor" || scene.selectedDoor !== "projects") return;
    dispatch({ type: "openRoom", room: "projects" });
  };

  const handleWheel = useCallback((event: WheelEvent) => {
    const root = experienceRootRef.current;
    if (!root || !(event.target instanceof Node) || !root.contains(event.target)) return;
    if (scene.screen !== "corridor" && scene.screen !== "entrance") return;
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;
    const normalizedDelta = Math.max(-300, Math.min(300, event.deltaY * unit));
    if (normalizedDelta === 0) return;
    event.preventDefault();
    const distance = normalizedDelta * 0.008;
    if (scene.screen === "entrance") {
      if (distance > 0) {
        pendingWalkRef.current += distance;
        dispatch({ type: "enter" });
      }
      return;
    }
    controlRef.current?.walkBy(distance);
  }, [scene.screen]);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    if (scene.screen !== "corridor") {
      walkKeysRef.current.clear();
      controlRef.current?.setWalkDirection(0);
      return;
    }

    const direction = () => {
      const keys = walkKeysRef.current;
      const forward = keys.has("w") || keys.has("arrowup");
      const backward = keys.has("s") || keys.has("arrowdown");
      controlRef.current?.setWalkDirection(forward === backward ? 0 : forward ? 1 : -1);
    };
    const pressedKeys = walkKeysRef.current;
    const activeControl = controlRef.current;
    const editableTarget = (target: EventTarget | null) => target instanceof HTMLElement
      && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (editableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (!["w", "s", "arrowup", "arrowdown"].includes(key)) return;
      if (key.startsWith("arrow")) event.preventDefault();
      walkKeysRef.current.add(key);
      direction();
    };
    const onKeyUp = (event: globalThis.KeyboardEvent) => {
      walkKeysRef.current.delete(event.key.toLowerCase());
      direction();
    };
    const onBlur = () => {
      walkKeysRef.current.clear();
      controlRef.current?.setWalkDirection(0);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      pressedKeys.clear();
      activeControl?.setWalkDirection(0);
    };
  }, [scene.screen]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable='true']")) return;
    if (scene.screen === "projects") {
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        const index = ENGINEERING_LAB_PROJECT_IDS.indexOf(scene.selectedProjectId);
        selectProject(ENGINEERING_LAB_PROJECT_IDS[(index + 1) % ENGINEERING_LAB_PROJECT_IDS.length]);
      }
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        const index = ENGINEERING_LAB_PROJECT_IDS.indexOf(scene.selectedProjectId);
        selectProject(ENGINEERING_LAB_PROJECT_IDS[(index - 1 + ENGINEERING_LAB_PROJECT_IDS.length) % ENGINEERING_LAB_PROJECT_IDS.length]);
      }
      return;
    }
    if (scene.screen !== "corridor") return;

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      event.preventDefault();
      const index = ROOM_IDS.indexOf(scene.selectedDoor);
      dispatch({ type: "selectDoor", room: ROOM_IDS[(index + 1) % ROOM_IDS.length] });
    }
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      event.preventDefault();
      const index = ROOM_IDS.indexOf(scene.selectedDoor);
      dispatch({ type: "selectDoor", room: ROOM_IDS[(index - 1 + ROOM_IDS.length) % ROOM_IDS.length] });
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || scene.screen === "transitioning" || showFallback) return;
    dragRef.current = { active: true, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    const deltaX = dragRef.current.x - event.clientX;
    const deltaY = dragRef.current.y - event.clientY;
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
    controlRef.current?.lookBy(deltaX, deltaY);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.active = false;
  };

  if (scene.screen === "simple") {
    return <GraphiteFallback onReturn={() => dispatch({ type: "returnToEntrance" })} />;
  }

  if (showFallback && !minimalTest) {
    const reason: FallbackReason = renderFailure?.reason ?? "webgl-unsupported";
    const fallbackMessages: Record<FallbackReason, string> = {
      "webgl-unsupported": "WebGL unsupported: this browser does not expose the WebGL API required by the 3D scene.",
      "webgl-context-failed": "WebGL context creation failed: the browser could not initialize the 3D renderer.",
      "canvas-initialization-error": "Canvas initialization error: React Three Fiber could not initialize the Canvas.",
      "scene-render-error": "Scene rendering error: the graphite world encountered a rendering exception.",
    };
    const fallbackDetails = renderFailure?.details ?? capabilities.webglReason ?? "The browser reports no WebGL API constructors.";
    return <GraphiteFallback message={fallbackMessages[reason]} details={fallbackDetails} />;
  }

  const selectedDoor = scene.screen === "corridor" ? scene.selectedDoor : "projects";
  const isCorridor = scene.screen === "corridor";
  const isEntering = scene.screen === "transitioning" && scene.destination === "corridor";
  const isOpening = scene.screen === "transitioning" && scene.destination === "projects";
  const isProjectLanding = scene.screen === "projects";
  const selectedProjectId: EngineeringLabProjectId = isProjectLanding ? scene.selectedProjectId : "medico-ai";
  const selectedProject = LAB_PROJECTS.find((project) => project.id === selectedProjectId)!;
  const selectedProjectNotes = LAB_EXHIBIT_NOTES[selectedProjectId];
  const canvasVisible = (minimalTest ? probesComplete : capabilities.webgl === true) && renderFailure === null;
  return (
    <main
      ref={experienceRootRef}
      className={`experience-shell experience-prototype${isProjectLanding ? " is-in-lab" : ""}${isCorridor || isProjectLanding ? " is-in-scene" : ""}`}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-r3f-test={minimalTest ? "minimal" : undefined}
      onKeyDown={handleKeyDown}
    >
      {minimalTest && (
        <p className="r3f-diagnostic-banner" role="status">
          Minimal R3F test active · default R3F renderer settings · blue box expected
        </p>
      )}
      {minimalTest && (
        <aside className="r3f-diagnostic-panel" aria-label="WebGL renderer diagnostics">
          <h2>Renderer diagnostics</h2>
          <dl>
            <dt>Active test</dt><dd>Minimal R3F box</dd>
            <dt>Canvas mounted</dt><dd>{canvasMounted ? "Yes" : canvasMountCount ? `No · ${canvasMountCount} mount attempt${canvasMountCount === 1 ? "" : "s"}` : canvasVisible ? "Loading" : "Not mounted"}</dd>
            <dt>Renderer initialized</dt><dd>{canvasWebglVersion ? `Yes · WebGL ${canvasWebglVersion}` : renderFailure ? "No · failed" : "Pending"}</dd>
            <dt>Context lost</dt><dd>{contextLost === null ? "Unknown / not initialized" : contextLost ? "Yes" : "No"}</dd>
          </dl>
          <h3>Temporary context tests</h3>
          {(["webgl2", "webgl"] as const).map((api) => {
            const result = webglProbes[api];
            return (
              <details key={api}>
                <summary>{api}: {result ? result.created ? "created" : "failed" : probesComplete ? "not run" : "testing"}; cleanup {result?.contextLost === true ? "confirmed" : result?.contextLost === false ? "not confirmed" : "pending"}</summary>
                {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
              </details>
            );
          })}
          <h3>Exception and stack</h3>
          <pre>{diagnosticException || renderFailure?.details || "No exception captured yet."}</pre>
          {renderFailure && (
            <div>
              <button type="button" disabled={nativeThreeRunning} onClick={() => void runNativeThreeComparison()}>
                {nativeThreeRunning ? "Running native Three.js…" : "Run native Three.js comparison"}
              </button>
              {nativeThreeResult && <pre>{nativeThreeResult}</pre>}
            </div>
          )}
        </aside>
      )}
      {canvasVisible && (
        <div
          ref={attachCanvasHost}
          className="experience-shell__canvas experience-prototype__canvas"
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <CanvasErrorBoundary onError={onCanvasInitializationError}>
            <Suspense fallback={<div className="experience-shell__loading" role="status">Preparing the graphite workshop…</div>}>
              <CanvasRoot
                minimalTest={minimalTest}
                scene={scene}
                reducedMotion={reducedMotion}
                dpr={capabilities.dpr}
                tier={capabilities.tier}
                method={revealMethod}
                revealed={revealed}
                controlRef={controlRef}
                onSelectDoor={(room) => dispatch({ type: "selectDoor", room })}
                onOpenRoom={(room) => dispatch({ type: "openRoom", room })}
                onReveal={toggleReveal}
                onTransitionComplete={onTransitionComplete}
                onSelectProject={selectProject}
                onSceneError={onSceneError}
                onCanvasReady={onCanvasReady}
                onCanvasMount={onCanvasMount}
                onContextLost={onContextLost}
              />
            </Suspense>
          </CanvasErrorBoundary>
        </div>
      )}

      <div className="experience-shell__content experience-prototype__content">
        <header className="experience-shell__header experience-prototype__header">
          <Link className="experience-shell__wordmark" to="/" aria-label="Aayush Angal portfolio home">AAYUSH ANGAL</Link>
          <nav className="experience-shell__quick-links" aria-label="Quick links">
            <a href="/resume.pdf" download="Aayush_Angal_Resume.pdf">Résumé</a>
            <button type="button" onClick={() => dispatch({ type: "showSimpleView" })}>Graphite-only view</button>
          </nav>
        </header>

        <div className="prototype-layout">
          <section className="prototype-intro" aria-labelledby="experience-heading">
            <p className="experience-panel__eyebrow">{isProjectLanding ? "Engineering Lab · field note 01" : "Graphite world · visual prototype"}</p>
            <h1 id="experience-heading">{isProjectLanding ? selectedProjectNotes.shortName : "A workshop drawn between code and art."}</h1>
            <p className="experience-panel__copy">
              {isProjectLanding
                ? "Three project artifacts, pinned drawings, and a central engineer’s bench. Select an exhibit to move closer; project details remain readable here."
                : "An original pencil-line entrance, a four-door corridor, and a signal-path study that moves from graphite into color."}
            </p>
            {capabilities.webgl === null && <p className="prototype-status" role="status">Checking browser graphics support…</p>}
            {import.meta.env.DEV && canvasWebglVersion !== null && (
              <p className="prototype-status" role="status">WebGL {canvasWebglVersion} Canvas initialized.</p>
            )}
            {scene.screen === "entrance" && (
              <div className="experience-panel__actions">
                <button type="button" className="experience-button" onClick={() => dispatch({ type: "enter" })}>Enter the workshop</button>
                <button type="button" className="experience-button experience-button--quiet" onClick={() => dispatch({ type: "showSimpleView" })}>Open illustrated view</button>
              </div>
            )}
            {isEntering && <p className="prototype-status" role="status" aria-live="polite">Following the pencil line into the corridor…</p>}
            {isOpening && <p className="prototype-status" role="status" aria-live="polite">Opening the Engineering Lab doorway…</p>}
            {isProjectLanding && (
              <div className="prototype-landing">
                <p className="experience-panel__eyebrow">Current exhibit · {selectedProjectNotes.shortName}</p>
                <p>{ROOM_NOTES.projects}</p>
                <button type="button" className="experience-button experience-button--quiet" onClick={() => dispatch({ type: "returnToCorridor" })}>Return to corridor</button>
              </div>
            )}
            {isCorridor && selectedDoor !== "projects" && (
              <p className="prototype-status" role="status" aria-live="polite">{ROOM_NOTES[selectedDoor]}</p>
            )}
          </section>

          <nav className="prototype-destinations" aria-label={isProjectLanding ? "Engineering Lab exhibits" : "Workshop destinations"}>
            <div className="prototype-section-heading">
              <span className="experience-panel__eyebrow">{isProjectLanding ? "Exhibit register" : "Waypoint register"}</span>
              <span className="prototype-pencil-note">{isProjectLanding ? "three studies · select to inspect" : "four doors · one open"}</span>
            </div>
            <ol className="experience-room-list">
              {isProjectLanding
                ? LAB_PROJECTS.map((project) => (
                    <li key={project.id}>
                      <button
                        type="button"
                        className="experience-room-list__item"
                        aria-pressed={selectedProjectId === project.id}
                        onClick={() => selectProject(project.id)}
                      >
                        <span>{LAB_EXHIBIT_NOTES[project.id].shortName}</span>
                        <span aria-hidden="true">{selectedProjectId === project.id ? "●" : "↗"}</span>
                      </button>
                    </li>
                  ))
                : ROOM_IDS.map((room) => (
                    <li key={room}>
                      <button
                        type="button"
                        className="experience-room-list__item"
                        aria-current={selectedDoor === room ? "location" : undefined}
                        onClick={() => selectDestination(room)}
                      >
                        <span>{ROOM_LABELS[room]}</span>
                        <span aria-hidden="true">{selectedDoor === room ? "●" : "↗"}</span>
                      </button>
                    </li>
                  ))}
            </ol>
            {isCorridor && (
              <div className="prototype-door-action">
                {selectedDoor === "projects" ? (
                  <button type="button" className="experience-button" onClick={openSelectedDoor}>Open selected doorway</button>
                ) : (
                  <p className="prototype-pencil-note">Choose 01 to test the working door.</p>
                )}
              </div>
            )}
            <p className="prototype-controls-hint">{isProjectLanding ? "Select an exhibit · ← / → or A / D to move between studies" : "Scroll or W / ↑ forward · S / ↓ back · A / D or ← / → select doors"}</p>
          </nav>

          {isProjectLanding && (
            <aside className="prototype-project-detail" aria-labelledby="project-detail-heading">
              <div className="prototype-section-heading">
                <span className="experience-panel__eyebrow">Workbench record / {selectedProjectNotes.shortName}</span>
                <span className="prototype-pencil-note">project file</span>
              </div>
              <h2 id="project-detail-heading">{selectedProject.title}</h2>
              <dl className="prototype-project-detail__facts">
                <dt>Problem</dt><dd>{selectedProjectNotes.problem}</dd>
                <dt>Engineering approach</dt><dd>{selectedProjectNotes.approach}</dd>
                <dt>Recorded outcome</dt><dd>{selectedProjectNotes.recordedOutcome}</dd>
                <dt>Technologies</dt><dd>{selectedProject.tags.join(" · ")}</dd>
                <dt>Individual contribution</dt><dd>Not specified in the existing typed project record.</dd>
              </dl>
              <details className="prototype-project-detail__source">
                <summary>Show original project summary</summary>
                <p>{selectedProject.description}</p>
              </details>
              <div className="prototype-project-detail__links" aria-label={`${selectedProjectNotes.shortName} links`}>
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noreferrer">
                    GitHub{selectedProject.githubVisibility === "private" ? " · private" : " ↗"}
                  </a>
                )}
                {selectedProject.demo && <a href={selectedProject.demo} target="_blank" rel="noreferrer">Live demo ↗</a>}
              </div>
              <button type="button" className="experience-button prototype-reveal" aria-pressed={revealed} onClick={toggleReveal}>
                {revealed ? "Return exhibit to graphite" : "Reveal exhibit accents"}
              </button>
            </aside>
          )}

          {!isProjectLanding && <aside className="prototype-study" aria-label="Sketch-to-color interaction study">
            <div className="prototype-section-heading">
              <span className="experience-panel__eyebrow">Object study · draft 07</span>
              <span className="prototype-pencil-note">signal path</span>
            </div>
            <p className="prototype-study__copy">A pencil schematic pinned at the corridor's end. Reveal the same original drawing in color.</p>
            <div className="prototype-method" role="group" aria-label="Reveal rendering method">
              <button type="button" aria-pressed={revealMethod === "shader"} onClick={() => setRevealMethod("shader")}>Shader</button>
              <button type="button" aria-pressed={revealMethod === "dom"} onClick={() => setRevealMethod("dom")}>DOM / CSS</button>
            </div>
            <button type="button" className="experience-button prototype-reveal" aria-pressed={revealed} onClick={toggleReveal}>
              {revealed ? "Return to graphite" : "Reveal sketch in color"}
            </button>
            <p className="prototype-method-note" aria-live="polite">
              {revealMethod === "shader"
                ? "Fragment shader · two local SVG maps · one plane draw."
                : "DOM layer · same SVG pair · CSS clip-path wipe."}
            </p>
          </aside>}

          <aside className="prototype-styleboard" aria-label="Graphite style board">
            <div className="prototype-styleboard__type">
              <span>LINE / 01</span>
              <strong>Graphite world</strong>
              <span>Editorial serif · clear system sans</span>
            </div>
            <div className="prototype-styleboard__strokes" aria-label="Pencil line-weight samples">
              <span className="stroke-sample stroke-sample--fine" title="Fine pencil line" />
              <span className="stroke-sample stroke-sample--medium" title="Structural graphite outline" />
              <span className="stroke-sample stroke-sample--soft" title="Soft pencil hatch" />
            </div>
            <div className="prototype-swatches" aria-label="Palette samples">
              <span className="swatch swatch--paper" title="Warm paper" />
              <span className="swatch swatch--graphite" title="Graphite" />
              <span className="swatch swatch--coral" title="Coral ink" />
              <span className="swatch swatch--cobalt" title="Cobalt" />
              <span className="swatch swatch--moss" title="Moss" />
            </div>
          </aside>
        </div>

        <footer className="experience-shell__footer experience-prototype__footer">
          <span>{reducedMotion ? "Reduced motion: camera snaps to each waypoint" : "Motion follows selected doors; reduced motion is respected"}</span>
          <span>{capabilities.touch ? "Touch drag and destination buttons available" : "Mouse drag, keyboard, and destination buttons available"}</span>
        </footer>
      </div>
    </main>
  );
}
