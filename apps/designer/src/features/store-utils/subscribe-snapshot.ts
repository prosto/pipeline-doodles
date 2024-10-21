import { has as hasProperty } from "lodash-es";
import { snapshot, subscribe } from "valtio";

export function subscribeSnapshot<T extends object>(
  state: T,
  propsToWait: string[],
  callback: (snap: ReturnType<typeof snapshot<T>>, ops: unknown[]) => void,
): () => void {
  return subscribe(state, (ops) => {
    const snap = snapshot(state);

    if (shouldWaitFulfilled(snap, ...propsToWait)) {
      return;
    }

    callback(snap, ops);
  });
}

export function shouldWaitFulfilled<T = Record<string, unknown>>(
  snap: T,
  ...props: string[]
): boolean {
  try {
    props.forEach((prop) => hasProperty(snap, prop));

    // all promises in a snapshot have been fulfilled, no need to wait any longer
    return false;
  } catch {
    // trigger wait and expect another call to the `shouldWaitFulfilled`
    return true;
  }
}
