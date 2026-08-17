"use client";

import { useEffect, useState } from "react";

type NetworkInformationLike = {
  saveData?: boolean;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
};

export type WebGLHeroCapability = {
  enabled: boolean;
  dpr: number;
  quality: "high" | "balanced";
};

const DISABLED: WebGLHeroCapability = {
  enabled: false,
  dpr: 1,
  quality: "balanced",
};

function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
      powerPreference: "high-performance",
    });

    if (!context) return false;

    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function readCapability(): WebGLHeroCapability {
  if (typeof window === "undefined") return DISABLED;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !supportsWebGL2()) return DISABLED;

  const nav = navigator as NavigatorWithHints;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const saveData = nav.connection?.saveData ?? false;
  const narrowViewport = window.innerWidth < 900;
  const weakMobile = narrowViewport && (memory <= 4 || cores <= 4 || saveData);

  if (weakMobile) return DISABLED;

  const balanced = narrowViewport || memory <= 6 || cores <= 6;
  const maxDpr = balanced ? 1.25 : 1.6;

  return {
    enabled: true,
    dpr: Math.min(window.devicePixelRatio || 1, maxDpr),
    quality: balanced ? "balanced" : "high",
  };
}

export function useWebGLHero() {
  const [capability, setCapability] = useState<WebGLHeroCapability>(DISABLED);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let resizeTimer: number | undefined;

    const update = () => setCapability(readCapability());
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(update, 120);
    };

    update();
    reducedMotion.addEventListener("change", update);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      reducedMotion.removeEventListener("change", update);
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return capability;
}
