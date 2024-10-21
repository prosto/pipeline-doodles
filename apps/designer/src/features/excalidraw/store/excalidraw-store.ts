import type { AppState, ExcalidrawElement } from "../types";

import { elementsStoreFactory } from "./elements-store";
import { excalidrawActionsFactory } from "./excalidraw-actions";
import { excalidrawAPI } from "./excalidraw-api";
import { excalidrawContext } from "./excalidraw-context";
import type { ExcalidrawStore } from "./types";

export function excalidrawStoreFactory(): ExcalidrawStore {
  const { elementsStore, excalidraw, excalidrawActions } =
    excalidrawContext.init({}, (bind) => {
      bind("elementsStore", elementsStoreFactory);
      bind("excalidraw", excalidrawAPI);
      bind("excalidrawActions", excalidrawActionsFactory);
    });

  const state: ExcalidrawStore["state"] = {
    excalidraw,
    excalidrawActions,
    elementsStore,
  };

  const {
    actions: { attachExcalidraw, detachExcalidraw, syncAppState },
  } = excalidraw;

  const {
    actions: { syncElements, clear: clearElementsInStore },
  } = elementsStore;

  const { registerCustomActions, syncActionsWithAppState } = excalidrawActions;

  function syncStateWithExcalidraw(
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ): void {
    syncAppState(appState);
    syncElements(elements);
    syncActionsWithAppState();
  }

  let unsubscribeCallback: () => void;

  const actions: ExcalidrawStore["actions"] = {
    connect(app, imperativeApi, moduleExports) {
      attachExcalidraw(app, imperativeApi, moduleExports);

      registerCustomActions();

      unsubscribeCallback = imperativeApi.onChange(syncStateWithExcalidraw);
    },

    disconnect() {
      detachExcalidraw();

      clearElementsInStore();

      unsubscribeCallback();
    },
  };

  return {
    state,
    actions,
  };
}
