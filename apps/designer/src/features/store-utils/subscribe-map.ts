import { subscribe } from "valtio";

export function subscribeMap<K, V>(
  state: Map<K, V>,
  callbacks: {
    onAdded?: (key: K, value: V) => void;
    onRemoved?: (key: K, value: V) => void;
  },
): () => void {
  return subscribe(state, (ops) => {
    for (const op of ops) {
      if (op[0] === "set") {
        const [, path, newMapValue, prevMapValue] = op;
        if (path.length === 2 && Array.isArray(newMapValue)) {
          const [key, value] = newMapValue as [K, V];

          if (Array.isArray(prevMapValue)) {
            const [prevKey, prevValue] = prevMapValue as [K, V];

            if (prevKey !== key && callbacks.onRemoved) {
              callbacks.onRemoved(prevKey, prevValue);
            }
          } else if (callbacks.onAdded) {
            callbacks.onAdded(key, value);
          }
        }
      }
    }
  });
}
