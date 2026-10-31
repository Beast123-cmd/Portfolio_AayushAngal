import { Edges } from "@react-three/drei/core/Edges";
import { DoubleSide, type ColorRepresentation, type Texture } from "three";

export const WARM_PAPER = "#f2eee5";
export const SOFT_GRAPHITE = "#514d46";
export const CONSTRUCTION_GRAPHITE = "#898278";

export function PencilMaterial({
  color = WARM_PAPER,
  map,
}: {
  color?: ColorRepresentation;
  map?: Texture;
}) {
  return <meshBasicMaterial color={color} map={map} side={DoubleSide} />;
}

export function PencilEdges({
  color = SOFT_GRAPHITE,
  threshold = 1.5,
}: {
  color?: ColorRepresentation;
  threshold?: number;
}) {
  return (
    <>
      <Edges color={color} threshold={threshold}>
        <lineBasicMaterial color={color} transparent opacity={0.76} depthWrite={false} />
      </Edges>
      <Edges position={[0.006, 0.004, -0.004]} color={CONSTRUCTION_GRAPHITE} threshold={threshold}>
        <lineBasicMaterial color={CONSTRUCTION_GRAPHITE} transparent opacity={0.22} depthWrite={false} />
      </Edges>
    </>
  );
}

export function PencilLinework({
  geometry,
  opacity = 0.18,
  color = SOFT_GRAPHITE,
}: {
  geometry: import("three").BufferGeometry;
  opacity?: number;
  color?: ColorRepresentation;
}) {
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  );
}
