import { useState } from "react";

export interface DeviceCapabilities {
  webgl: boolean | null;
  touch: boolean;
  lowPower: boolean;
  dpr: number;
}

function readDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === "undefined") return { webgl: null, touch: false, lowPower: false, dpr: 1 };

  const nav = navigator as Navigator & { deviceMemory?: number };
  const touch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  const narrowScreen = window.matchMedia("(max-width: 760px)").matches;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCoreCount = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
  const lowPower = narrowScreen || lowMemory || lowCoreCount;

  return {
    webgl: canCreateWebGLContext(),
    touch,
    lowPower,
    dpr: Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5),
  };
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities] = useState(readDeviceCapabilities);
  return capabilities;
}
