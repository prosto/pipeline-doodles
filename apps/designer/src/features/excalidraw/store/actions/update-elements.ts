import { match, P } from "ts-pattern";

import type { Action, ActionName } from "../../types";
import { excalidrawContext } from "../excalidraw-context";
import type { UpdateElementsForm } from "../types";

export function updateElementsAction(): Action {
  const {
    excalidraw: {
      state: excalidrawState,
      actions: { newElement },
    },
  } = excalidrawContext.useX();

  return {
    name: "updateElements" as ActionName,
    predicate: () => excalidrawState.isConnected === true,
    perform: (elements, appState, formData: UpdateElementsForm) => {
      const updates = match(formData)
        .with({ updates: P._ }, (data) => data.updates)
        .with({ elementIds: P._ }, (data) =>
          Object.fromEntries(
            data.elementIds.map((id) => [id, data.updateData]),
          ),
        )
        .with({ elements: P._ }, (data) =>
          Object.fromEntries(data.elements.map((el) => [el.id, el])),
        )
        .exhaustive();

      return {
        elements: elements.map((el) => {
          if (el.id in updates) {
            const updatedElement = newElement(el, updates[el.id]);

            if (
              updatedElement.version !== el.version &&
              formData.changeVersion === false
            ) {
              Object.assign(updatedElement, {
                updated: el.updated,
                version: el.version,
                versionNonce: el.versionNonce,
              });
            }

            return updatedElement;
          }
          return el;
        }),
        appState,
        commitToHistory: Boolean(formData.commitToHistory),
      };
    },
    trackEvent: false,
  };
}
