import { isDefined } from "@repo/shared/utils";
import { subscribe } from "valtio";

export function subscribeSet<V>(
  state: Set<V>,
  callbacks: {
    onAdded?: (value: V) => void;
    onRemoved?: (value: V) => void;
  },
): () => void {
  return subscribe(state, (ops) => {
    for (const op of ops) {
      if (op[0] === "set") {
        const [, path, newSetValue, prevSetValue] = op;
        if (path.length === 2) {
          const value = newSetValue as V;
          if (isDefined(prevSetValue)) {
            const prevValue = prevSetValue as V;

            if (callbacks.onRemoved) {
              callbacks.onRemoved(prevValue);
            }
          } else if (callbacks.onAdded) {
            callbacks.onAdded(value);
          }
        }
      }
    }
  });
}
