import { lazy, Suspense, useRef, type MutableRefObject } from "react";
import type { Group } from "three";
import type { EngineeringLabProjectId } from "@/graphite/data/labProjectIds";
import { CameraDirector } from "@/graphite/components/experience/CameraDirector";
import type { CameraControlHandle } from "@/graphite/components/experience/cameraControls";
import { CorridorWorld } from "@/graphite/components/experience/CorridorWorld";
import type { RoomId, SceneState } from "@/graphite/components/experience/sceneState";
import type { RevealMethod } from "@/graphite/components/experience/SketchExhibit";

const EngineeringLab = lazy(() => import("@/graphite/components/experience/EngineeringLab"));

interface WorkshopSceneProps {
  scene: SceneState;
  reducedMotion: boolean;
  method: RevealMethod;
  revealed: boolean;
  controlRef: MutableRefObject<CameraControlHandle | null>;
  onSelectDoor: (room: RoomId) => void;
  onOpenRoom: (room: RoomId) => void;
  onReveal: () => void;
  onTransitionComplete: () => void;
  onSelectProject: (id: EngineeringLabProjectId) => void;
}

export function WorkshopScene(props: WorkshopSceneProps) {
  const projectDoorRef = useRef<Group>(null);
  const selectedDoor = props.scene.screen === "corridor" ? props.scene.selectedDoor : "projects";

  return (
    <>
      <CorridorWorld
        selectedDoor={selectedDoor}
        projectDoorRef={projectDoorRef}
        method={props.method}
        revealed={props.revealed}
        reducedMotion={props.reducedMotion}
        onSelectDoor={props.onSelectDoor}
        onOpenRoom={props.onOpenRoom}
        onReveal={props.onReveal}
      />
      {(props.scene.screen === "projects" || (props.scene.screen === "transitioning" && props.scene.destination === "projects")) && (
        <Suspense fallback={null}>
          <EngineeringLab
            selectedProjectId={props.scene.screen === "projects" ? props.scene.selectedProjectId : "medico-ai"}
            revealed={props.revealed}
            onSelectProject={props.onSelectProject}
          />
        </Suspense>
      )}
      <CameraDirector
        scene={props.scene}
        reducedMotion={props.reducedMotion}
        controlRef={props.controlRef}
        projectDoorRef={projectDoorRef}
        selectedProjectId={props.scene.screen === "projects" ? props.scene.selectedProjectId : "medico-ai"}
        onTransitionComplete={props.onTransitionComplete}
      />
    </>
  );
}
