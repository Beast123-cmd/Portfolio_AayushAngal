export const ROOM_IDS = ["projects", "experience", "studio", "contact"] as const;

export type RoomId = (typeof ROOM_IDS)[number];
export type SceneState =
  | { screen: "entrance" }
  | { screen: "corridor" }
  | { screen: "transitioning"; destination: RoomId }
  | { screen: RoomId }
  | { screen: "simple" };

export type SceneAction =
  | { type: "enter" }
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
      return state.screen === "entrance" ? { screen: "corridor" } : state;
    case "openRoom":
      return state.screen === "corridor" && ROOM_IDS.includes(action.room)
        ? { screen: "transitioning", destination: action.room }
        : state;
    case "transitionComplete":
      return state.screen === "transitioning" ? { screen: state.destination } : state;
    case "returnToCorridor":
      return ROOM_IDS.includes(state.screen as RoomId) ? { screen: "corridor" } : state;
    case "showSimpleView":
      return state.screen === "simple" ? state : { screen: "simple" };
    case "returnToEntrance":
      return state.screen === "simple" ? { screen: "entrance" } : state;
    default:
      return state;
  }
}
