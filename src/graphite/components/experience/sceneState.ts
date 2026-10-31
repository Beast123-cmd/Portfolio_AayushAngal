import { isEngineeringLabProjectId, type EngineeringLabProjectId } from "@/graphite/data/labProjectIds";

export const ROOM_IDS = ["projects", "experience", "studio", "contact"] as const;

export type RoomId = (typeof ROOM_IDS)[number];
export type SceneState =
  | { screen: "entrance" }
  | { screen: "corridor"; selectedDoor: RoomId }
  | { screen: "transitioning"; destination: RoomId | "corridor" }
  | { screen: "projects"; selectedProjectId: EngineeringLabProjectId }
  | { screen: Exclude<RoomId, "projects"> }
  | { screen: "simple" };

export type SceneAction =
  | { type: "enter" }
  | { type: "selectDoor"; room: RoomId }
  | { type: "selectProject"; projectId: EngineeringLabProjectId }
  | { type: "openRoom"; room: RoomId }
  | { type: "transitionComplete" }
  | { type: "returnToCorridor" }
  | { type: "showSimpleView" }
  | { type: "returnToEntrance" };

export const initialSceneState: SceneState = { screen: "entrance" };

/** Discrete scene navigation state; camera transforms belong to the future Canvas coordinator. */
export function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case "enter":
      return state.screen === "entrance" ? { screen: "transitioning", destination: "corridor" } : state;
    case "selectDoor":
      return state.screen === "corridor" && ROOM_IDS.includes(action.room)
        ? { screen: "corridor", selectedDoor: action.room }
        : state;
    case "openRoom":
      return state.screen === "corridor" && action.room === "projects"
        ? { screen: "transitioning", destination: action.room }
        : state;
    case "selectProject":
      return state.screen === "projects" && isEngineeringLabProjectId(action.projectId)
        ? { ...state, selectedProjectId: action.projectId }
        : state;
    case "transitionComplete":
      if (state.screen !== "transitioning") return state;
      return state.destination === "corridor"
        ? { screen: "corridor", selectedDoor: "projects" }
        : state.destination === "projects"
          ? { screen: "projects", selectedProjectId: "medico-ai" }
          : { screen: state.destination };
    case "returnToCorridor":
      return state.screen === "projects" ? { screen: "corridor", selectedDoor: "projects" } : state;
    case "showSimpleView":
      return state.screen === "simple" ? state : { screen: "simple" };
    case "returnToEntrance":
      return state.screen === "simple" ? { screen: "entrance" } : state;
    default:
      return state;
  }
}
