import { useEffect, useMemo } from "react";
import { Edges } from "@react-three/drei/core/Edges";
import { Html } from "@react-three/drei/web/Html";
import * as THREE from "three";
import type { EngineeringLabProjectId } from "@/graphite/data/labProjectIds";
import { LAB_PROJECTS, LAB_EXHIBIT_NOTES } from "@/graphite/data/engineeringLab";

interface EngineeringLabProps {
  selectedProjectId: EngineeringLabProjectId;
  revealed: boolean;
  onSelectProject: (id: EngineeringLabProjectId) => void;
}

const EXHIBITS: Array<{ id: EngineeringLabProjectId; z: number; accent: string }> = [
  { id: "medico-ai", z: 1.15, accent: "#a4432d" },
  { id: "researchsync", z: -1.5, accent: "#4169a8" },
  { id: "elevra-ai", z: -4.15, accent: "#64806b" },
];

type Stroke = [[number, number], [number, number]];
const EXHIBIT_STROKES: Record<EngineeringLabProjectId, Stroke[]> = {
  "medico-ai": [
    [[-0.6, 0.42], [-0.14, 0.42]], [[-0.14, 0.42], [0.16, 0.14]], [[0.16, 0.14], [0.58, 0.14]],
    [[-0.14, 0.42], [0.13, -0.2]], [[0.13, -0.2], [0.58, -0.2]],
    [[-0.6, -0.46], [0.58, -0.46]], [[-0.6, -0.62], [0.32, -0.62]],
  ],
  researchsync: [
    [[-0.58, 0.58], [0.05, 0.58]], [[-0.58, 0.38], [0.58, 0.38]], [[-0.58, 0.18], [0.28, 0.18]],
    [[-0.58, -0.06], [0.58, -0.06]], [[-0.58, -0.28], [0.05, -0.28]],
    [[0.18, -0.38], [0.35, -0.55]], [[0.35, -0.55], [0.62, -0.2]],
  ],
  "elevra-ai": [
    [[-0.58, -0.52], [-0.58, 0.58]], [[-0.58, -0.52], [0.62, -0.52]],
    [[-0.38, -0.5], [-0.38, -0.08]], [[-0.06, -0.5], [-0.06, 0.2]],
    [[0.26, -0.5], [0.26, 0.43]], [[0.56, -0.5], [0.56, 0.12]],
    [[-0.52, 0.4], [-0.12, 0.58]], [[-0.12, 0.58], [0.22, 0.22]], [[0.22, 0.22], [0.58, 0.45]],
  ],
};

function ExhibitSketch({ id, z, selected, revealed, accent, onSelect }: {
  id: EngineeringLabProjectId;
  z: number;
  selected: boolean;
  revealed: boolean;
  accent: string;
  onSelect: () => void;
}) {
  const lineGeometry = useMemo(() => {
    const coordinates = EXHIBIT_STROKES[id].flatMap(([start, end]) => [
      start[0], start[1], 0.012, end[0], end[1], 0.012,
    ]);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coordinates, 3));
    return geometry;
  }, [id]);
  useEffect(() => () => lineGeometry.dispose(), [lineGeometry]);
  const colorVisible = selected && revealed;
  const note = LAB_EXHIBIT_NOTES[id];
  const project = LAB_PROJECTS.find((item) => item.id === id)!;

  return (
    <group position={[-9.94, 2.58, z]} rotation={[0, Math.PI / 2, 0]}>
      <mesh
        onClick={(event) => { event.stopPropagation(); onSelect(); }}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
      >
        <planeGeometry args={[2.2, 1.62]} />
        <meshBasicMaterial color={colorVisible ? "#f0e9dc" : "#e7e1d7"} />
      </mesh>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={colorVisible ? accent : "#363431"} transparent opacity={colorVisible ? 0.96 : 0.72} />
      </lineSegments>
      <mesh position={[0, 0, -0.025]}>
        <planeGeometry args={[2.32, 1.74]} />
        <meshBasicMaterial color="#d3ccbf" />
      </mesh>
      <Html position={[0, -1.08, 0.02]} center transform={false}>
        <span className={`lab-wall-label${selected ? " is-selected" : ""}`} aria-hidden="true">
          {note.shortName} / {project.tags.slice(0, 2).join(" · ")}
        </span>
      </Html>
    </group>
  );
}

function ExhibitObject({ id, z, selected, revealed, accent, onSelect }: {
  id: EngineeringLabProjectId;
  z: number;
  selected: boolean;
  revealed: boolean;
  accent: string;
  onSelect: () => void;
}) {
  const highlight = selected && revealed ? accent : "#393734";
  return (
    <group
      position={[-6.6, 1.22, z]}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
      onPointerOver={() => { document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}
    >
      {id === "medico-ai" && (
        <>
          <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.66, 0.58, 0.16]} /><meshStandardMaterial color="#e5ded2" roughness={1} /><Edges color={highlight} /></mesh>
          <mesh position={[0, 0.12, 0.09]}><boxGeometry args={[0.16, 0.3, 0.025]} /><meshStandardMaterial color={highlight} roughness={1} /></mesh>
          <mesh position={[0, 0.12, 0.11]}><boxGeometry args={[0.36, 0.12, 0.025]} /><meshStandardMaterial color={highlight} roughness={1} /></mesh>
          <mesh position={[0, -0.34, 0]}><boxGeometry args={[0.84, 0.08, 0.34]} /><meshStandardMaterial color="#d0c8bb" roughness={1} /><Edges color="#393734" /></mesh>
        </>
      )}
      {id === "researchsync" && (
        <>
          <mesh position={[0, 0.1, 0]} rotation={[0, 0, -0.045]}><boxGeometry args={[0.58, 0.76, 0.08]} /><meshStandardMaterial color="#eee8dd" roughness={1} /><Edges color={highlight} /></mesh>
          <mesh position={[0.03, 0.2, 0.05]}><boxGeometry args={[0.34, 0.025, 0.015]} /><meshStandardMaterial color={highlight} roughness={1} /></mesh>
          <mesh position={[0.03, 0.08, 0.05]}><boxGeometry args={[0.34, 0.018, 0.015]} /><meshStandardMaterial color="#77736c" roughness={1} /></mesh>
          <mesh position={[0.03, -0.04, 0.05]}><boxGeometry args={[0.26, 0.018, 0.015]} /><meshStandardMaterial color="#77736c" roughness={1} /></mesh>
          <mesh position={[0.02, -0.34, 0]}><boxGeometry args={[0.84, 0.08, 0.34]} /><meshStandardMaterial color="#d0c8bb" roughness={1} /><Edges color="#393734" /></mesh>
        </>
      )}
      {id === "elevra-ai" && (
        <>
          {[-0.24, -0.08, 0.08, 0.24].map((x, index) => (
            <mesh key={x} position={[x, -0.04 + index * 0.12, 0]}>
              <boxGeometry args={[0.105, 0.3 + index * 0.13, 0.12]} />
              <meshStandardMaterial color={selected && revealed ? accent : "#d4ccbf"} roughness={1} />
              <Edges color="#393734" />
            </mesh>
          ))}
          <mesh position={[0, -0.34, 0]}><boxGeometry args={[0.84, 0.08, 0.34]} /><meshStandardMaterial color="#d0c8bb" roughness={1} /><Edges color="#393734" /></mesh>
        </>
      )}
      <mesh position={[0.34, -0.12, 0.14]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color={highlight} roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function EngineeringLab({ selectedProjectId, revealed, onSelectProject }: EngineeringLabProps) {
  return (
    <group>
      {/* A compact, open-sided studio continues naturally from the corridor doorway. */}
      <mesh position={[-6.55, -0.14, -1.45]}>
        <boxGeometry args={[7.1, 0.18, 9.55]} /><meshStandardMaterial color="#e1d9cc" roughness={1} /><Edges color="#45423d" threshold={1.8} />
      </mesh>
      <mesh position={[-10.08, 2.1, -1.45]}>
        <boxGeometry args={[0.16, 4.2, 9.55]} /><meshStandardMaterial color="#eee9df" roughness={1} /><Edges color="#45423d" threshold={1.5} />
      </mesh>
      <mesh position={[-6.55, 2.1, -6.22]}>
        <boxGeometry args={[7.1, 4.2, 0.16]} /><meshStandardMaterial color="#eee9df" roughness={1} /><Edges color="#45423d" threshold={1.5} />
      </mesh>
      <mesh position={[-6.55, 2.1, 3.32]}>
        <boxGeometry args={[7.1, 4.2, 0.16]} /><meshStandardMaterial color="#eee9df" roughness={1} /><Edges color="#45423d" threshold={1.5} />
      </mesh>
      <mesh position={[-6.55, 4.19, -1.45]}>
        <boxGeometry args={[7.1, 0.12, 9.55]} /><meshStandardMaterial color="#e9e3d8" roughness={1} /><Edges color="#78746e" threshold={1.5} />
      </mesh>

      {/* Hand-drawn technical sheets and the three tactile project artifacts. */}
      {EXHIBITS.map(({ id, z, accent }) => (
        <group key={id}>
          <ExhibitSketch
            id={id}
            z={z}
            selected={selectedProjectId === id}
            revealed={revealed}
            accent={accent}
            onSelect={() => onSelectProject(id)}
          />
          <ExhibitObject
            id={id}
            z={z}
            selected={selectedProjectId === id}
            revealed={revealed}
            accent={accent}
            onSelect={() => onSelectProject(id)}
          />
        </group>
      ))}

      {/* Central engineer's workbench, drafted from simple original geometry. */}
      <group position={[-6.25, 0, -1.48]}>
        <mesh position={[-0.3, 0.88, 0]}>
          <boxGeometry args={[1.38, 0.14, 3.5]} /><meshStandardMaterial color="#bdb4a6" roughness={1} /><Edges color="#302e2b" threshold={1.3} />
        </mesh>
        {[-0.5, 0.5].flatMap((x) => [-1.52, 1.52].map((z) => (
          <mesh key={`${x}-${z}`} position={[x - 0.3, 0.43, z]}>
            <boxGeometry args={[0.1, 0.82, 0.1]} /><meshStandardMaterial color="#8c857a" roughness={1} /><Edges color="#393734" />
          </mesh>
        )))}
        <mesh position={[-0.3, 0.15, 0]}>
          <boxGeometry args={[1.22, 0.12, 3.2]} /><meshStandardMaterial color="#cfc7ba" roughness={1} /><Edges color="#393734" />
        </mesh>
        <mesh position={[0.38, 0.98, -1.18]} rotation={[0.12, 0, -0.08]}>
          <boxGeometry args={[0.52, 0.025, 0.72]} /><meshStandardMaterial color="#f2eee5" roughness={1} /><Edges color="#4a4742" />
        </mesh>
        <mesh position={[0.36, 1.015, -1.16]}>
          <boxGeometry args={[0.32, 0.012, 0.018]} /><meshStandardMaterial color="#4169a8" roughness={1} />
        </mesh>
      </group>

      <ambientLight intensity={0.95} />
      <directionalLight position={[-7, 6, 2]} intensity={0.38} />
    </group>
  );
}
