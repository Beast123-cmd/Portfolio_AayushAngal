export interface CameraControlHandle {
  /** Move the look target from a drag gesture. */
  lookBy: (deltaX: number, deltaY: number) => void;
  /** Set held forward/back input as -1, 0, or 1. */
  setWalkDirection: (direction: -1 | 0 | 1) => void;
  /** Apply a normalized forward scroll impulse in world units. */
  walkBy: (distance: number) => void;
}
