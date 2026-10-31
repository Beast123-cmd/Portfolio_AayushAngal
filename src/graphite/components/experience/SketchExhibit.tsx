import { useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei/core/useTexture";
import { Html } from "@react-three/drei/web/Html";
import { gsap } from "gsap";
import * as THREE from "three";
import sketchUrl from "@/graphite/assets/world/world-signal-path-graphite.svg";
import colorUrl from "@/graphite/assets/world/world-signal-path-color.svg";

export type RevealMethod = "shader" | "dom";

interface SketchExhibitProps {
  method: RevealMethod;
  revealed: boolean;
  reducedMotion: boolean;
  onReveal: () => void;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uSketch;
  uniform sampler2D uColor;
  uniform float uProgress;
  varying vec2 vUv;
  void main() {
    float handEdge = sin(vUv.y * 57.0 + sin(vUv.x * 23.0)) * 0.018
      + sin(vUv.x * 79.0 + vUv.y * 13.0) * 0.012;
    float edge = mix(-0.08, 1.08, uProgress) + handEdge;
    float colorReveal = 1.0 - smoothstep(edge - 0.026, edge + 0.026, vUv.x);
    vec4 graphite = texture2D(uSketch, vUv);
    vec4 color = texture2D(uColor, vUv);
    gl_FragColor = mix(graphite, color, colorReveal);
  }
`;

function ShaderExhibit({ revealed, reducedMotion, onReveal }: Omit<SketchExhibitProps, "method">) {
  const [sketch, color] = useTexture([sketchUrl, colorUrl]);
  const material = useMemo(() => {
    sketch.colorSpace = THREE.SRGBColorSpace;
    color.colorSpace = THREE.SRGBColorSpace;
    return new THREE.ShaderMaterial({
      uniforms: {
        uSketch: { value: sketch },
        uColor: { value: color },
        uProgress: { value: 0 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      toneMapped: false,
    });
  }, [sketch, color]);

  useEffect(() => {
    const tween = gsap.to(material.uniforms.uProgress, {
      value: revealed ? 1 : 0,
      duration: reducedMotion ? 0 : 1.15,
      ease: "power2.inOut",
    });
    return () => { tween.kill(); };
  }, [material, reducedMotion, revealed]);

  useEffect(() => () => {
    material.dispose();
    useTexture.clear([sketchUrl, colorUrl]);
    sketch.dispose();
    color.dispose();
  }, [material, sketch, color]);

  return (
    <mesh
      position={[0, 2.05, -14.17]}
      onClick={(event) => { event.stopPropagation(); onReveal(); }}
    >
      <planeGeometry args={[2.55, 1.58]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function DomExhibit({ revealed }: Pick<SketchExhibitProps, "revealed">) {
  return (
    <Html transform distanceFactor={8} position={[0, 2.05, -14.16]}>
      <div className="world-dom-exhibit" aria-hidden="true">
        <img className="world-dom-exhibit__sketch" src={sketchUrl} alt="" />
        <img
          className="world-dom-exhibit__color"
          src={colorUrl}
          alt=""
          style={{ clipPath: `inset(0 ${revealed ? 0 : 100}% 0 0)` }}
        />
      </div>
    </Html>
  );
}

export function SketchExhibit({ method, revealed, reducedMotion, onReveal }: SketchExhibitProps) {
  return (
    <group>
      <mesh position={[0, 2.05, -14.25]}>
        <boxGeometry args={[2.85, 1.95, 0.13]} />
        <meshStandardMaterial color="#e8e0d2" roughness={1} />
      </mesh>
      {method === "shader"
        ? <ShaderExhibit revealed={revealed} reducedMotion={reducedMotion} onReveal={onReveal} />
        : <DomExhibit revealed={revealed} />}
    </group>
  );
}
