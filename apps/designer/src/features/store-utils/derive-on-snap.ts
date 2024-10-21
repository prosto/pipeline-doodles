import { proxy, snapshot, subscribe } from "valtio";

export function deriveOnSnap<T extends object, U extends object>(
  proxyObject: T,
  onReadyCallback: (
    snap: ReturnType<typeof snapshot<T>>,
  ) => U | null | undefined,
  defaultState: U,
): U {
  const state = proxy(defaultState);

  subscribe(proxyObject, () => {
    const snap = snapshot(proxyObject);

    const newState = onReadyCallback(snap);

    if (newState) {
      Object.assign(state, newState);
    }
  });

  return state;
}
