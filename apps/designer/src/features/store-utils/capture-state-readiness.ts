import type { DeferredPromise } from "@repo/shared/utils";
import { deferredPromise } from "@repo/shared/utils";
import { snapshot, subscribe } from "valtio";

export function captureStateReadiness<T extends object>(
  state: T,
  callback?: (state: T) => void,
): DeferredPromise<T> {
  const stateIsReadyDeferred = deferredPromise<T>();

  const unsubscribe = subscribe(state, () => {
    // This will resolve any promises in the state so we have a complete data set
    const snap = snapshot(state);
    const resolvedState = snap as T;
    stateIsReadyDeferred.resolve(resolvedState);

    // Unsubscribe from state changes to make it a one time event
    unsubscribe();

    callback?.(resolvedState);
  });

  return stateIsReadyDeferred;
}
