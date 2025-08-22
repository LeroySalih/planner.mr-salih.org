// app/components/MobileConsole.tsx
"use client";
import { useEffect } from "react";

export default function MobileConsole() {
  useEffect(() => {
    // only enable when you want (env or ?debug)
    const enabled =
      process.env.NEXT_PUBLIC_SHOW_CONSOLE === "1" ||
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).has("debug"));

    if (!enabled) return;

    (async () => {
      const eruda = (await import("eruda")).default;
      // @ts-ignore - eruda types can be fussy
      if (!(eruda as any)._isInit) eruda.init();
    })();
  }, []);

  return null;
}
