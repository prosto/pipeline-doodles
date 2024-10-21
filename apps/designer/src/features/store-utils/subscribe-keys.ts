import { subscribe } from "valtio";

export function subscribeKeys<T extends object, K extends keyof T>(
  proxyObject: T,
  keys: K[],
  callback: (values: T[K][], ops: unknown[]) => void,
  notifyInSync?: boolean,
): () => void {
  let prevValues = keys.map((key) => proxyObject[key]);

  return subscribe(
    proxyObject,
    (ops) => {
      const nextValues = keys.map((key) => proxyObject[key]);
      const hasNoChanges = prevValues.every((prevValue, index) =>
        Object.is(prevValue, nextValues[index]),
      );

      if (!hasNoChanges) {
        prevValues = nextValues;
        callback(nextValues, ops);
      }
    },
    notifyInSync,
  );
}
