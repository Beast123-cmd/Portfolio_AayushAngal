import { useEffect, useImperativeHandle, useRef, type MutableRefObject, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import type { Group } from "three";
import type { SceneState } from "@/graphite/components/experience/sceneState";
import type { CameraControlHandle } from "@/graphite/components/experience/cameraControls";
import { DOOR_POSITIONS } from "@/graphite/components/experience/roomLayout";
import type { EngineeringLabProjectId } from "@/graphite/data/labProjectIds";

interface CameraDirectorProps {
  scene: SceneState;
  reducedMotion: boolean;
  controlRef: MutableRefObject<CameraControlHandle | null>;
  projectDoorRef: RefObject<Group | null>;
  selectedProjectId: EngineeringLabProjectId;
  onTransitionComplete: () => void;
}

interface CameraPose {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

const START_POSE: CameraPose = { x: 0, y: 1.75, z: 6.2, yaw: 0, pitch: 0.015 };
const LAB_ENTRY_POSE: CameraPose = { x: -3.65, y: 1.72, z: -1.42, yaw: 1.25, pitch: 0.015 };
const CORRIDOR_Z_MIN = -13.05;
const CORRIDOR_Z_MAX = 3.35;
const WALK_SPEED = 3.4;

function corridorPose(room: keyof typeof DOOR_POSITIONS): CameraPose {
  const door = DOOR_POSITIONS[room];
  return {
    x: 0,
    y: 1.72,
    z: door.z + 3.8,
    yaw: Math.atan2(-door.side * 2.9, 3.8),
    pitch: 0.01,
  };
}

function projectPose(projectId: EngineeringLabProjectId): CameraPose {
  const zByProject: Record<EngineeringLabProjectId, number> = {
    "medico-ai": 1.15,
    researchsync: -1.5,
    "elevra-ai": -4.15,
  };
  return { x: -4.3, y: 1.72, z: zByProject[projectId], yaw: Math.PI / 2, pitch: 0.015 };
}

export function CameraDirector({ scene, reducedMotion, controlRef, projectDoorRef, selectedProjectId, onTransitionComplete }: CameraDirectorProps) {
  const { camera } = useThree();
  const pose = useRef<CameraPose>({ ...START_POSE });
  const locked = useRef(false);
  const initialized = useRef(false);
  const walkDirection = useRef<-1 | 0 | 1>(0);
  const previousScene = useRef<SceneState>(scene);

  useImperativeHandle(controlRef, () => ({
    lookBy(deltaX, deltaY) {
      if (locked.current) return;
      pose.current.yaw = Math.max(-1.18, Math.min(1.18, pose.current.yaw + deltaX * 0.004));
      pose.current.pitch = Math.max(-0.28, Math.min(0.28, pose.current.pitch + deltaY * 0.003));
    },
    setWalkDirection(direction) {
      walkDirection.current = locked.current ? 0 : direction;
    },
    walkBy(distance) {
      if (locked.current) return;
      pose.current.z = Math.max(CORRIDOR_Z_MIN, Math.min(CORRIDOR_Z_MAX, pose.current.z - distance));
    },
  }), []);

  useFrame((_, delta) => {
    if (!initialized.current) {
      camera.position.set(pose.current.x, pose.current.y, pose.current.z);
      camera.rotation.order = "YXZ";
      camera.rotation.set(pose.current.pitch, pose.current.yaw, 0);
      initialized.current = true;
      return;
    }

    if (!locked.current && walkDirection.current !== 0) {
      pose.current.z = Math.max(
        CORRIDOR_Z_MIN,
        Math.min(CORRIDOR_Z_MAX, pose.current.z - walkDirection.current * WALK_SPEED * Math.min(delta, 0.05)),
      );
    }

    const blend = reducedMotion ? 1 : 1 - Math.exp(-14 * Math.min(delta, 0.05));
    camera.position.x += (pose.current.x - camera.position.x) * blend;
    camera.position.y += (pose.current.y - camera.position.y) * blend;
    camera.position.z += (pose.current.z - camera.position.z) * blend;
    camera.rotation.x += (pose.current.pitch - camera.rotation.x) * blend;
    camera.rotation.y += (pose.current.yaw - camera.rotation.y) * blend;
  });

  const destination = scene.screen === "transitioning" ? scene.destination : null;
  const selectedDoor = scene.screen === "corridor" ? scene.selectedDoor : null;

  useEffect(() => {
    if (scene.screen === "entrance" || scene.screen === "simple") return;

    const arrivedFromEntrance = scene.screen === "corridor"
      && previousScene.current.screen === "transitioning"
      && previousScene.current.destination === "corridor";
    previousScene.current = scene;
    if (arrivedFromEntrance) {
      // The entrance transition already landed at this corridor pose. Avoid a
      // second waypoint tween so the first queued scroll impulse is preserved.
      locked.current = false;
      return;
    }

    const transitioning = scene.screen === "transitioning";
    walkDirection.current = 0;
    const currentDoor = selectedDoor ?? "projects";
    const target = transitioning
      ? (destination === "projects" ? LAB_ENTRY_POSE : corridorPose("projects"))
      : scene.screen === "corridor"
        ? corridorPose(currentDoor)
        : scene.screen === "projects"
          ? projectPose(selectedProjectId)
        : START_POSE;

    locked.current = true;
    const timeline = gsap.timeline({
      onComplete: () => {
        locked.current = false;
        if (transitioning) onTransitionComplete();
      },
    });

    if (transitioning && destination === "projects" && projectDoorRef.current) {
      timeline.to(projectDoorRef.current.rotation, { y: -1.05, duration: reducedMotion ? 0 : 0.72, ease: "power2.inOut" }, 0);
    }
    if (scene.screen === "corridor" && projectDoorRef.current) {
      timeline.to(projectDoorRef.current.rotation, { y: 0, duration: reducedMotion ? 0 : 0.48, ease: "power2.out" }, 0);
    }

    timeline.to(pose.current, {
      ...target,
      duration: reducedMotion ? 0 : transitioning ? 0.92 : 0.7,
      ease: "power2.inOut",
    }, 0);

    return () => {
      timeline.kill();
      locked.current = false;
    };
  }, [scene, scene.screen, destination, selectedDoor, selectedProjectId, reducedMotion, onTransitionComplete, projectDoorRef]);

  return null;
}
