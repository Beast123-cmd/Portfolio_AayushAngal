import { lazy, Suspense, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { CanvasErrorBoundary } from "@/components/experience/CanvasErrorBoundary";
import { initialSceneState, ROOM_IDS, sceneReducer, type RoomId } from "@/components/experience/sceneState";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Index from "@/pages/Index";
import "@/styles/experience-shell.css";

const CanvasRoot = lazy(() => import("@/components/experience/CanvasRoot"));

const ROOM_LABELS: Record<RoomId, string> = {
  projects: "01 · Engineering Lab",
  experience: "02 · The Journey",
  studio: "03 · Art Studio",
  contact: "04 · Connect",
};

const ROOM_DESCRIPTIONS: Record<RoomId, string> = {
  projects: "Project exhibits will be connected to the existing portfolio records in a later phase.",
  experience: "The existing work and education timeline remains available in the simple portfolio view.",
  studio: "The studio will use original artwork supplied for this portfolio; no placeholder artwork is shown.",
  contact: "Contact details and the existing form remain available in the simple portfolio view.",
};

export default function ExperienceShell() {
  const [scene, dispatch] = useReducer(sceneReducer, initialSceneState);
  const [rendererFailed, setRendererFailed] = useState(false);
  const capabilities = useDeviceCapabilities();
  const reducedMotion = useReducedMotion();
  const showFallback = capabilities.webgl === false || rendererFailed;

  useEffect(() => {
    if (scene.screen !== "transitioning") return;
    const delay = reducedMotion ? 0 : 180;
    const timer = window.setTimeout(() => dispatch({ type: "transitionComplete" }), delay);
    return () => window.clearTimeout(timer);
  }, [scene, reducedMotion]);

  if (scene.screen === "simple") {
    return (
      <div className="simple-portfolio-view">
        <div className="simple-portfolio-view__return">
          <button type="button" className="experience-button experience-button--quiet" onClick={() => dispatch({ type: "returnToEntrance" })}>
            Return to experience preview
          </button>
        </div>
        <Index />
      </div>
    );
  }

  if (showFallback) {
    return (
      <div className="simple-portfolio-view">
        <div className="simple-portfolio-view__return" role="status">
          <p>3D graphics are unavailable. Here is the complete readable portfolio.</p>
          <Link to="/terminal">Open terminal</Link>
        </div>
        <Index />
      </div>
    );
  }

  const activeRoom = ROOM_IDS.find((room) => room === scene.screen);
  const showCanvas = capabilities.webgl === true && !rendererFailed;

  return (
    <main className="experience-shell" data-reduced-motion={reducedMotion ? "true" : "false"}>
      {showCanvas && (
        <div className="experience-shell__canvas" aria-hidden="true">
          <CanvasErrorBoundary onError={() => setRendererFailed(true)}>
            <Suspense fallback={<div className="experience-shell__loading" role="status">Preparing the experience…</div>}>
              <CanvasRoot dpr={capabilities.dpr} onUnavailable={() => setRendererFailed(true)} />
            </Suspense>
          </CanvasErrorBoundary>
        </div>
      )}

      <div className="experience-shell__content">
        <header className="experience-shell__header">
          <Link className="experience-shell__wordmark" to="/" aria-label="Aayush Angal portfolio home">AAYUSH ANGAL</Link>
          <nav className="experience-shell__quick-links" aria-label="Quick links">
            <a href="/resume.pdf" download="Aayush_Angal_Resume.pdf">Résumé</a>
            <Link to="/terminal">Terminal</Link>
            <button type="button" onClick={() => dispatch({ type: "showSimpleView" })}>Simple view</button>
          </nav>
        </header>

        <section className="experience-panel" aria-labelledby="experience-heading">
          {scene.screen === "entrance" && (
            <>
              <p className="experience-panel__eyebrow">A world drawn between code and art</p>
              <h1 id="experience-heading">Aayush Angal</h1>
              <p className="experience-panel__lead">AI/ML Intern · Backend &amp; AI Systems</p>
              <p className="experience-panel__copy">
                PICT Electronics and Telecommunication undergraduate and AI/ML Intern at Prorigo. I build enterprise AI workflows,
                backend integrations, and data-driven products with a focus on reliable, explainable software.
              </p>
              <div className="experience-panel__actions">
                <button type="button" className="experience-button" onClick={() => dispatch({ type: "enter" })}>Enter the world</button>
                <button type="button" className="experience-button experience-button--quiet" onClick={() => dispatch({ type: "showSimpleView" })}>Skip experience / View portfolio</button>
              </div>
              {capabilities.webgl === null && <p className="experience-panel__small" role="status">Checking graphics support; the page remains usable while it loads.</p>}
            </>
          )}

          {scene.screen === "corridor" && (
            <>
              <p className="experience-panel__eyebrow">Choose a destination</p>
              <h1 id="experience-heading">Explore the portfolio</h1>
              <p className="experience-panel__copy">The room navigation is available now; room artwork and 3D scenes will be introduced in later approved phases.</p>
              <div className="experience-room-list" aria-label="Portfolio destinations">
                {ROOM_IDS.map((room) => (
                  <button key={room} type="button" className="experience-room-list__item" onClick={() => dispatch({ type: "openRoom", room })}>
                    <span>{ROOM_LABELS[room]}</span><span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <button type="button" className="experience-button experience-button--quiet" onClick={() => dispatch({ type: "showSimpleView" })}>Open readable portfolio</button>
            </>
          )}

          {scene.screen === "transitioning" && (
            <div role="status" aria-live="polite">
              <p className="experience-panel__eyebrow">Moving to</p>
              <h1 id="experience-heading">{ROOM_LABELS[scene.destination]}</h1>
            </div>
          )}

          {activeRoom && (
            <>
              <p className="experience-panel__eyebrow">Portfolio room</p>
              <h1 id="experience-heading">{ROOM_LABELS[activeRoom]}</h1>
              <p className="experience-panel__copy">{ROOM_DESCRIPTIONS[activeRoom]}</p>
              <div className="experience-panel__actions">
                <button type="button" className="experience-button" onClick={() => dispatch({ type: "returnToCorridor" })}>Back to destinations</button>
                <button type="button" className="experience-button experience-button--quiet" onClick={() => dispatch({ type: "showSimpleView" })}>View complete portfolio</button>
              </div>
            </>
          )}

        </section>

        <footer className="experience-shell__footer">
          <span>{reducedMotion ? "Reduced motion enabled" : "Motion can be reduced in your system settings"}</span>
          <span>{capabilities.touch ? "Touch controls available" : "Keyboard and pointer controls available"}</span>
        </footer>
      </div>
    </main>
  );
}
