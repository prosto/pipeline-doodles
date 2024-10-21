import type { Action, ActionName } from "../../types";
import { excalidrawContext } from "../excalidraw-context";

export function imageExportAction(): Action {
  const {
    excalidraw: { state: excalidrawState },
  } = excalidrawContext.useX();

  return {
    name: "imageExport" as ActionName,
    predicate: () => excalidrawState.isConnected === true,
    perform: (elements, appState) => {
      return {
        elements,
        appState: {
          ...appState,
          openDialog: "imageExport",
        },
        commitToHistory: false,
      };
    },
    trackEvent: false,
  };
}
