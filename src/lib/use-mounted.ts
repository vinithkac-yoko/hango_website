"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * SSR-safe "has the client taken over yet" flag — for gating theme-derived
 * rendering (server has no way to know a stored preference) without the
 * setState-in-effect anti-pattern a useState+useEffect mount flag would be.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
