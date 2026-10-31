import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";

interface CanvasRootProps {
  onUnavailable: () => void;
  dpr: number;
}

interface UnavailableNoticeProps {
  onUnavailable: () => void;
}

function UnavailableNotice({ onUnavailable }: UnavailableNoticeProps) {
  // R3F renders this fallback only when it cannot create its WebGL renderer.
  useEffect(() => onUnavailable(), [onUnavailable]);
  return null;
}

export default function CanvasRoot({ onUnavailable, dpr }: CanvasRootProps) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr}
      shadows={false}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
      fallback={<UnavailableNotice onUnavailable={onUnavailable} />}
    >
      <color attach="background" args={["#f2eee5"]} />
    </Canvas>
  );
}
