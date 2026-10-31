import { useEffect, useState } from "react";

export interface DeviceCapabilities {
  webgl: boolean | null;
  touch: boolean;
  tier: "high" | "medium" | "low";
  dpr: number;
  webglReason?: string;
}

const INITIAL_CAPABILITIES: DeviceCapabilities = { webgl: null, touch: false, tier: "medium", dpr: 1 };

function readDeviceCapabilities(): DeviceCapabilities {
  const webglAvailable = typeof window.WebGLRenderingContext !== "undefined"
    || typeof window.WebGL2RenderingContext !== "undefined";

  const nav = navigator as Navigator & { deviceMemory?: number };
  const touch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCoreCount = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
  const mobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    || (touch && window.matchMedia("(max-width: 760px)").matches);
  const tier: DeviceCapabilities["tier"] = lowMemory
    ? "low"
    : lowCoreCount
      ? (mobileDevice ? "low" : "medium")
      : mobileDevice
        ? "medium"
        : "high";
  const maxDpr = tier === "high" ? 1.5 : tier === "medium" ? 1.25 : 1;

  return {
    // Feature-detect the API without allocating or forcibly losing a second GL context.
    // Canvas initialization is the authoritative check that a usable context can be created.
    webgl: webglAvailable,
    webglReason: webglAvailable
      ? undefined
      : "The browser does not expose WebGLRenderingContext or WebGL2RenderingContext.",
    touch,
    tier,
    dpr: Math.min(window.devicePixelRatio || 1, maxDpr),
  };
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState(INITIAL_CAPABILITIES);

  useEffect(() => {
    // Read browser APIs after mount so server rendering and the first client render
    // never depend on window, navigator, matchMedia, or WebGL globals.
    setCapabilities(readDeviceCapabilities());
  }, []);

  return capabilities;
}
