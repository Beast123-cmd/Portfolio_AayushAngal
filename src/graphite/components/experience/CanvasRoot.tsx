import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, type ErrorInfo, type MutableRefObject } from "react";
import { Color } from "three";
import type { RoomId, SceneState } from "@/graphite/components/experience/sceneState";
import type { EngineeringLabProjectId } from "@/graphite/data/labProjectIds";
import type { CameraControlHandle } from "@/graphite/components/experience/cameraControls";
import type { RevealMethod } from "@/graphite/components/experience/SketchExhibit";
import { CanvasErrorBoundary } from "@/graphite/components/experience/CanvasErrorBoundary";
import { WARM_PAPER } from "@/graphite/components/experience/PencilStyle";
import { WorkshopScene } from "@/graphite/components/experience/WorkshopScene";

interface CanvasRootProps {
  minimalTest: boolean;
  scene: SceneState;
  reducedMotion: boolean;
  dpr: number;
  tier: "high" | "medium" | "low";
  method: RevealMethod;
  revealed: boolean;
  controlRef: MutableRefObject<CameraControlHandle | null>;
  onSelectDoor: (room: RoomId) => void;
  onOpenRoom: (room: RoomId) => void;
  onReveal: () => void;
  onTransitionComplete: () => void;
  onSelectProject: (id: EngineeringLabProjectId) => void;
  onSceneError: (error: Error, info: ErrorInfo) => void;
  onCanvasReady: (webglVersion: number) => void;
  onCanvasMount: (mounted: boolean) => void;
  onContextLost: (event: Event) => void;
}

function AdaptivePerformance({ startingDpr }: { startingDpr: number }) {
  const setDpr = useThree((state) => state.setDpr);
  const hasReducedOnce = useRef(false);
  const reduceQuality = useCallback(() => {
    if (hasReducedOnce.current) return;
    hasReducedOnce.current = true;
    setDpr(Math.max(0.8, startingDpr * 0.8));
  }, [setDpr, startingDpr]);

  return <PerformanceMonitor flipflops={3} onDecline={reduceQuality} onFallback={() => setDpr(0.8)} />;
}

function MinimalRendererScene() {
  return (
    <>
      <ambientLight intensity={1} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4169a8" />
      </mesh>
    </>
  );
}

export default function CanvasRoot({
  minimalTest,
  scene,
  reducedMotion,
  dpr,
  tier,
  method,
  revealed,
  controlRef,
  onSelectDoor,
  onOpenRoom,
  onReveal,
  onTransitionComplete,
  onSelectProject,
  onSceneError,
  onCanvasReady,
  onCanvasMount,
  onContextLost,
}: CanvasRootProps) {
  const contextListenerRef = useRef<{ canvas: HTMLCanvasElement; listener: (event: Event) => void } | null>(null);
  const canvasProps = minimalTest
    ? {}
    : {
        dpr,
        shadows: false,
        gl: {
          antialias: tier !== "low",
          alpha: false,
          powerPreference: tier === "high" ? "high-performance" as const : tier === "medium" ? "default" as const : "low-power" as const,
        },
        camera: { position: [0, 1.75, 6.2] as [number, number, number], fov: 54, near: 0.1, far: 60 },
      };

  useEffect(() => {
    onCanvasMount(true);
    return () => {
      const current = contextListenerRef.current;
      if (current) current.canvas.removeEventListener("webglcontextlost", current.listener);
      contextListenerRef.current = null;
      onCanvasMount(false);
    };
  }, [onCanvasMount]);

  return (
    <Canvas
      key={minimalTest ? "minimal-webgl-test" : "graphite-world"}
      {...canvasProps}
      aria-hidden={!minimalTest}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(WARM_PAPER, 1);
        scene.background = new Color(WARM_PAPER);
        const version = gl.capabilities.isWebGL2 ? 2 : 1;
        const listener = (event: Event) => onContextLost(event);
        contextListenerRef.current = { canvas: gl.domElement, listener };
        gl.domElement.addEventListener("webglcontextlost", listener);
        if (import.meta.env.DEV) {
          console.info(`[experience] ${minimalTest ? "Minimal test" : "Graphite scene"} initialized with WebGL ${version}.`, {
            attributes: gl.getContext().getContextAttributes(),
            canvas: { width: gl.domElement.width, height: gl.domElement.height },
          });
        }
        onCanvasReady(version);
      }}
    >
      {minimalTest ? (
        <CanvasErrorBoundary onError={onSceneError}>
          <MinimalRendererScene />
        </CanvasErrorBoundary>
      ) : (
        <>
          <AdaptivePerformance startingDpr={dpr} />
          <CanvasErrorBoundary onError={onSceneError}>
            <Suspense fallback={null}>
              <WorkshopScene
                scene={scene}
                reducedMotion={reducedMotion}
                method={method}
                revealed={revealed}
                controlRef={controlRef}
                onSelectDoor={onSelectDoor}
                onOpenRoom={onOpenRoom}
                onReveal={onReveal}
                onTransitionComplete={onTransitionComplete}
                onSelectProject={onSelectProject}
              />
            </Suspense>
          </CanvasErrorBoundary>
        </>
      )}
    </Canvas>
  );
}
