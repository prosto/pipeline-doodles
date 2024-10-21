import assign from "lodash-es/assign";
import { proxy } from "valtio";
import { proxyMap } from "valtio/utils";

import type { ActionName } from "../types";

import { imageExportAction } from "./actions/image-export";
import { jsonExportAction } from "./actions/json-export";
import { selectElementsAction } from "./actions/select-elements";
import { updateElementsAction } from "./actions/update-elements";
import { excalidrawContext } from "./excalidraw-context";
import type {
  CanvasAction,
  CanvasActionName,
  ExcalidrawActions,
  UnavailableCanvasAction,
} from "./types";

export function excalidrawActionsFactory(): ExcalidrawActions {
  const {
    excalidraw: {
      state: excalidrawState,
      actions: { getActionManager, getImperativeApi },
    },
  } = excalidrawContext.useX();

  const actionMap = proxyMap<
    CanvasActionName,
    CanvasAction | UnavailableCanvasAction
  >();

  function actionStateFactory(actionName: CanvasActionName): CanvasAction {
    const actionManager = getActionManager();
    const appState = getImperativeApi().getAppState();

    const excalidrawAction = actionManager.actions[actionName as ActionName];

    return {
      enabled: actionManager.isActionEnabled(excalidrawAction),
      checked: excalidrawAction.checked?.(appState),
      run: (value) => {
        actionManager.executeAction(excalidrawAction, "api", value);
      },
    };
  }

  const actionsToRegister = [
    imageExportAction(),
    jsonExportAction(),
    updateElementsAction(),
    selectElementsAction(),
  ];

  const actions: ExcalidrawActions = {
    registerCustomActions() {
      getActionManager().registerAll(actionsToRegister);
    },

    getAction(name) {
      const actionProxy = actionMap.get(name);

      if (!actionProxy) {
        const newActionProxy = excalidrawState.isConnected
          ? proxy(actionStateFactory(name as ActionName))
          : proxy({
              enabled: false,
              checked: false,
              run: function voidRunner() {
                // do nothing.
              },
            });

        actionMap.set(name, newActionProxy);
        return newActionProxy;
      }

      return actionProxy;
    },

    runAction(name, value) {
      actions.getAction(name).run(value);
    },

    syncActionsWithAppState() {
      if (excalidrawState.isConnected) {
        for (const [actionName, actionProxy] of actionMap) {
          assign(actionProxy, actionStateFactory(actionName));
        }
      }
    },
  };

  return actions;
}
