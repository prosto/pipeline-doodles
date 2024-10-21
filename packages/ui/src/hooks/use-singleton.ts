import { useRef } from "react";

export function useSingleton<T>(factory: () => T): T {
  const mountedRef = useRef<T>();

  return mountedRef.current
    ? mountedRef.current
    : (mountedRef.current = factory());
}
