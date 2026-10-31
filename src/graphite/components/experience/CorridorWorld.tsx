import { useEffect, useMemo } from "react";
import { Html } from "@react-three/drei/web/Html";
import * as THREE from "three";
import type { Group } from "three";
import { ROOM_IDS, type RoomId } from "@/graphite/components/experience/sceneState";
import { DOOR_LABELS, DOOR_POSITIONS } from "@/graphite/components/experience/roomLayout";
import { CONSTRUCTION_GRAPHITE, PencilEdges, PencilLinework, PencilMaterial, SOFT_GRAPHITE, WARM_PAPER } from "@/graphite/components/experience/PencilStyle";
import { SketchExhibit, type RevealMethod } from "@/graphite/components/experience/SketchExhibit";

interface CorridorWorldProps {
  selectedDoor: RoomId;
  projectDoorRef: React.RefObject<Group | null>;
  method: RevealMethod;
  revealed: boolean;
  reducedMotion: boolean;
  onSelectDoor: (room: RoomId) => void;
  onOpenRoom: (room: RoomId) => void;
  onReveal: () => void;
}

function makeWallGeometry(side: -1 | 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(19, 0);
  shape.lineTo(19, 4.2);
  shape.lineTo(0, 4.2);
  shape.closePath();

  for (const room of ROOM_IDS) {
    const door = DOOR_POSITIONS[room];
    const center = side === -1 ? 4.6 - door.z : door.z + 14.4;
    const opening = new THREE.Path();
    opening.moveTo(center - 0.86, 0.12);
    opening.lineTo(center - 0.86, 2.92);
    opening.lineTo(center + 0.86, 2.92);
    opening.lineTo(center + 0.86, 0.12);
    opening.closePath();
    shape.holes.push(opening);
  }

  return new THREE.ShapeGeometry(shape, 1);
}

function CorridorWall({ side }: { side: -1 | 1 }) {
  const wall = useMemo(() => makeWallGeometry(side), [side]);
  useEffect(() => () => wall.dispose(), [wall]);
  return (
    <mesh
      geometry={wall}
      position={side === -1 ? [-3.12, 0, 4.6] : [3.12, 0, -14.4]}
      rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
    >
      <PencilMaterial color="#f2eee5" />
    </mesh>
  );
}

function DoorFrame({
  room,
  selected,
  projectDoorRef,
  onSelectDoor,
  onOpenRoom,
}: {
  room: RoomId;
  selected: boolean;
  projectDoorRef: import("react").RefObject<Group | null>;
  onSelectDoor: (room: RoomId) => void;
  onOpenRoom: (room: RoomId) => void;
}) {
  const { z, side } = DOOR_POSITIONS[room];
  const hingeOffset = side === -1 ? 0.78 : -0.78;
  const active = room === "projects";
  const leafColor = selected ? "#e9dfd0" : "#f2eee5";
  const clickDoor = () => {
    onSelectDoor(room);
    if (active) onOpenRoom(room);
  };

  return (
    <group>
      <mesh position={[side * 3.015, 1.45, z - 0.9]}>
        <boxGeometry args={[0.16, 2.92, 0.11]} />
        <PencilMaterial color="#e8e0d3" />
        <PencilEdges threshold={1} />
      </mesh>
      <mesh position={[side * 3.015, 1.45, z + 0.9]}>
        <boxGeometry args={[0.16, 2.92, 0.11]} />
        <PencilMaterial color="#e8e0d3" />
        <PencilEdges threshold={1} />
      </mesh>
      <mesh position={[side * 3.015, 2.94, z]}>
        <boxGeometry args={[0.16, 0.12, 1.88]} />
        <PencilMaterial color="#e8e0d3" />
        <PencilEdges threshold={1} />
      </mesh>
      <group
        ref={active ? projectDoorRef : undefined}
        position={[side * 3.015, 0, z + hingeOffset]}
      >
        <mesh
          position={[0, 1.44, -hingeOffset]}
          onClick={(event) => { event.stopPropagation(); clickDoor(); }}
        >
          <boxGeometry args={[0.12, 2.72, 1.62]} />
          <PencilMaterial color={leafColor} />
          <PencilEdges color={selected ? "#98644e" : SOFT_GRAPHITE} threshold={1} />
        </mesh>
        <mesh position={[side * -0.072, 1.46, -hingeOffset - side * 0.42]}>
          <boxGeometry args={[0.012, 1.7, 0.012]} />
          <meshStandardMaterial color="#9b9285" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[side * -0.078, 1.44, -hingeOffset + side * 0.54]}>
          <sphereGeometry args={[0.065, 8, 6]} />
          <meshStandardMaterial color={active ? "#c87557" : "#8e877d"} roughness={1} metalness={0} />
        </mesh>
      </group>
      <Html position={[side * 2.86, 3.18, z]} center distanceFactor={8}>
        <span className={`world-door-label${selected ? " is-selected" : ""}`} aria-hidden="true">
          {DOOR_LABELS[room]}
        </span>
      </Html>
      {active && (
        <Html position={[side * 2.88, 0.2, z]} center distanceFactor={8}>
          <span className="world-door-note" aria-hidden="true">open prototype</span>
        </Html>
      )}
    </group>
  );
}

type Stroke = [[number, number, number], [number, number, number]];

const PENCIL_STROKES: Stroke[] = [
  ...[-12, -9.4, -7.1, -4.8, -2.5, -0.2, 2.1].map((z, index) => [
    [-2.85, -0.005, z], [2.85, -0.005, z + (index % 2 ? 0.025 : -0.025)],
  ] as Stroke),
  ...[-8, -5, -2, 1].map((z) => [[0, 0.01, z], [0.035, 0.01, z - 0.08]] as Stroke),
  [[-3.05, 3.88, 4.08], [-3.01, 3.9, -14.05]],
  [[3.04, 3.89, 4.08], [3.02, 3.91, -14.05]],
];

const GRAPHITE_STROKES: Stroke[] = [
  ...[-12, -9.4, -7.1, -4.8, -2.5, -0.2, 2.1].map((z, index) => [
    [-2.85, 0.008, z + 0.025], [2.85, 0.008, z + 0.04 + (index % 2 ? 0.01 : 0)],
  ] as Stroke),
  [[-3.06, 3.92, 4.1], [-3.03, 3.94, -14.1]],
  [[3.06, 3.91, 4.08], [3.04, 3.93, -14.05]],
];

function makeStrokeGeometry(strokes: Stroke[]) {
  const coordinates = strokes.flatMap(([start, end]) => [...start, ...end]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(coordinates, 3));
  return geometry;
}

function DraftingLines() {
  const pencilGeometry = useMemo(() => makeStrokeGeometry(PENCIL_STROKES), []);
  const graphiteGeometry = useMemo(() => makeStrokeGeometry(GRAPHITE_STROKES), []);
  useEffect(() => () => {
    pencilGeometry.dispose();
    graphiteGeometry.dispose();
  }, [pencilGeometry, graphiteGeometry]);
  return (
    <group>
      <lineSegments geometry={pencilGeometry}>
        <lineBasicMaterial color={CONSTRUCTION_GRAPHITE} transparent opacity={0.34} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={graphiteGeometry}>
        <lineBasicMaterial color={SOFT_GRAPHITE} transparent opacity={0.24} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function makeHatchingGeometry() {
  const coordinates: number[] = [];
  const add = (start: [number, number, number], end: [number, number, number]) => coordinates.push(...start, ...end);

  // Short, lightly varied strokes gather along the floor edges and wall margins.
  for (let z = -13.7; z < 4.2; z += 0.78) {
    for (let x = -2.88; x <= 2.88; x += 0.42) {
      if (Math.abs(x) < 1.75) continue;
      const wobble = Math.sin(z * 1.7 + x * 2.1) * 0.025;
      add([x, -0.037, z], [x + 0.22, -0.037, z - 0.12 + wobble]);
    }
  }

  for (const side of [-1, 1] as const) {
    for (let z = -13.6; z < 4; z += 0.44) {
      for (let y = 0.28; y < 4.05; y += 0.38) {
        const inDoor = ROOM_IDS.some((room) => Math.abs(DOOR_POSITIONS[room].z - z) < 1.05 && y < 3.05);
        if (inDoor || ((Math.round(z * 10) + Math.round(y * 10)) % 3 === 0)) continue;
        const x = side * 3.105;
        const wobble = Math.sin(z * 2 + y * 3) * 0.025;
        add([x, y, z], [x, y + 0.16 + wobble, z - 0.1]);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(coordinates, 3));
  return geometry;
}

function SurfaceHatching() {
  const geometry = useMemo(makeHatchingGeometry, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <PencilLinework geometry={geometry} opacity={0.19} color="#777168" />;
}

export function CorridorWorld(props: CorridorWorldProps) {
  const { selectedDoor, projectDoorRef, method, revealed, reducedMotion, onSelectDoor, onOpenRoom, onReveal } = props;
  return (
    <group>
      <CorridorWall side={-1} />
      <CorridorWall side={1} />
      <mesh position={[0, -0.13, -4.9]}>
        <boxGeometry args={[6.24, 0.18, 19.3]} />
        <PencilMaterial color="#eee8dd" />
        <PencilEdges threshold={2} />
      </mesh>
      <mesh position={[0, 4.28, -4.9]}>
        <boxGeometry args={[6.24, 0.16, 19.3]} />
        <PencilMaterial color="#f4f0e8" />
        <PencilEdges color={CONSTRUCTION_GRAPHITE} threshold={2} />
      </mesh>
      <mesh position={[0, 2.1, -14.42]}>
        <boxGeometry args={[6.24, 4.2, 0.16]} />
        <PencilMaterial color="#f2eee5" />
        <PencilEdges threshold={1} />
      </mesh>
      <mesh position={[0, 3.15, 4.02]}>
        <boxGeometry args={[5.7, 0.18, 0.26]} />
        <PencilMaterial color="#e8e0d3" />
        <PencilEdges threshold={1} />
      </mesh>
      <mesh position={[-2.78, 1.72, 4.02]}>
        <boxGeometry args={[0.18, 3.05, 0.26]} />
        <PencilMaterial color="#e8e0d3" />
        <PencilEdges threshold={1} />
      </mesh>
      <mesh position={[2.78, 1.72, 4.02]}>
        <boxGeometry args={[0.18, 3.05, 0.26]} />
        <PencilMaterial color="#e8e0d3" />
        <PencilEdges threshold={1} />
      </mesh>
      <DraftingLines />
      <SurfaceHatching />

      {ROOM_IDS.map((room) => (
        <DoorFrame
          key={room}
          room={room}
          selected={selectedDoor === room}
          projectDoorRef={projectDoorRef}
          onSelectDoor={onSelectDoor}
          onOpenRoom={onOpenRoom}
        />
      ))}

      <group>
        <SketchExhibit method={method} revealed={revealed} reducedMotion={reducedMotion} onReveal={onReveal} />
        <Html position={[0, 3.25, -14.17]} center>
          <span className="world-exhibit-label" aria-hidden="true">DRAFT 07 / SIGNAL PATH</span>
        </Html>
      </group>
      <ambientLight intensity={1.18} color="#fffaf0" />
      <directionalLight position={[-4, 7, 6]} intensity={0.34} color="#fff3de" />
    </group>
  );
}
