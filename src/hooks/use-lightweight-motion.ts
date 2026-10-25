import { useEffect, useState } from "react";

/** Start light during SSR/hydration; only enable decorative loops on capable screens. */
export function useLightweightMotion() {
  const [lightweight, setLightweight] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px), (pointer: coarse), (prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => setLightweight(query.matches || Boolean(connection?.saveData) || document.hidden);
    update();
    query.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return lightweight;
}