import type { Action, ActionName, ExcalidrawElement } from "../../types";
import { excalidrawContext } from "../excalidraw-context";

export function selectElementsAction(): Action {
  const {
    excalidraw: {
      state: excalidrawState,
      actions: { getActionManager },
    },
  } = excalidrawContext.useX();

  return {
    name: "selectElements" as ActionName,
    predicate: () => excalidrawState.isConnected === true,
    perform: async (elements, appState, formData, app) => {
      const elementsToSelect = formData as ExcalidrawElement[];

      if (elementsToSelect.length === 1) {
        const [selectedElement] = elementsToSelect;
        if (selectedElement.type === "text" && selectedElement.containerId) {
          return {
            elements,
            appState: {
              ...appState,
              selectedElementIds: {
                [selectedElement.id]: true,
              },
            },
            commitToHistory: false,
          };
        }
      }

      const selectAllAction = getActionManager().actions.selectAll;

      const actionResult = await selectAllAction.perform(
        elementsToSelect,
        appState,
        formData,
        app,
      );

      if (typeof actionResult === "boolean") {
        return actionResult;
      }

      // const elementsToSelect = (formData as ExcalidrawElement[]).filter(
      //   (element) => !element.isDeleted && !element.locked
      // );

      return {
        elements,
        appState: actionResult.appState,
        commitToHistory: false,
      };
    },
    trackEvent: false,
  };
}
