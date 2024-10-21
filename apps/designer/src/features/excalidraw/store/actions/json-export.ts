import type { Action, ActionName } from "../../types";
import { excalidrawContext } from "../excalidraw-context";

export function jsonExportAction(): Action {
  const {
    excalidraw: { state: excalidrawState },
  } = excalidrawContext.useX();

  return {
    name: "jsonExport" as ActionName,
    predicate: () => excalidrawState.isConnected === true,
    perform: (elements, appState) => {
      return {
        elements,
        appState: {
          ...appState,
          openDialog: "jsonExport",
        },
        commitToHistory: false,
      };
    },
    trackEvent: false,
  };
}
