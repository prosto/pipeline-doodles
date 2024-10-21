import { ensureIsDefined } from "@repo/shared/utils";
import { merge } from "lodash-es";
import { proxy } from "valtio";

import type { AppState, ExcalidrawElement } from "../types";

import { isCustomExcalidrawElement } from "./type-utils";
import type { ElementRef, ElementsStore } from "./types";

export function elementsStoreFactory(): ElementsStore {
  const elementsMap = new Map<string, ExcalidrawElement>();
  const stagedElementsMap = new Map<string, ExcalidrawElement>();

  const state = {
    changes: proxy({
      added: [],
      deleted: [],
      updated: [],
      removed: [],
    }),
  };

  function getRef<T extends ExcalidrawElement = ExcalidrawElement>(
    elementId: string,
  ): ElementRef<T> {
    return stagedElementsMap.has(elementId)
      ? elementRef(elementId, stagedElementsMap)
      : elementRef(elementId, elementsMap);
  }

  function getRefs<T extends ExcalidrawElement = ExcalidrawElement>(
    elementId: string[],
  ): ElementRef<T>[] {
    return elementId.map((id) => getRef(id));
  }

  function updateCustomData(
    element: ExcalidrawElement,
    data: {
      id?: string;
      prevElementId?: string;
      status?: "ready" | "staged" | "attach";
    },
  ): void {
    merge(element, {
      customData: {
        ...data,
      },
    });
  }

  function removeStagedElement(
    newElement: ExcalidrawElement,
    removed: ElementRef[],
  ): void {
    if (
      isCustomExcalidrawElement(newElement) &&
      newElement.customData.status === "staged" &&
      newElement.customData.prevElementId
    ) {
      const stagedElementId = newElement.customData.prevElementId;
      const stagedElement = stagedElementsMap.get(stagedElementId);
      if (stagedElement) {
        stagedElementsMap.delete(stagedElementId);
        removed.push(staticElementRef(stagedElement));
      }
    }
  }

  const actions: ElementsStore["actions"] = {
    syncElements(elements: readonly ExcalidrawElement[]): void {
      if (elements.length === 0) {
        // Avoid redundant handling when no elements available
        return;
      }

      const changes: ElementsStore["state"]["changes"] = {
        added: [],
        updated: [],
        deleted: [],
        removed: [],
      };

      for (const element of elements) {
        const elementInStore = elementsMap.get(element.id);
        elementsMap.set(element.id, element);

        if (!elementInStore) {
          removeStagedElement(element, changes.removed);
          changes.added.push(getRef(element.id));
        } else if (elementInStore.version !== element.version) {
          if (!elementInStore.isDeleted && element.isDeleted) {
            changes.deleted.push(getRef(element.id));
          } else {
            changes.updated.push(getRef(element.id));
          }
        }
      }

      if (
        changes.added.length ||
        changes.deleted.length ||
        changes.removed.length ||
        changes.updated.length
      ) {
        Object.assign(state.changes, changes);
      }
    },

    addStaged<T extends ExcalidrawElement>(
      elements: readonly T[],
    ): ElementRef<T>[] {
      for (const element of elements) {
        // store element id for later reference so that it could be removed later
        updateCustomData(element, {
          prevElementId: element.id,
          status: "staged",
        });
        stagedElementsMap.set(element.id, element);
      }
      return getRefs(elements.map((el) => el.id));
    },

    clear() {
      elementsMap.clear();
      stagedElementsMap.clear();
    },

    getRef,

    getRefs,

    getElement(id: string) {
      return elementsMap.get(id);
    },

    getElements(ids: string[] | AppState["selectedElementIds"]) {
      const elementIds = Array.isArray(ids) ? ids : Object.keys(ids);

      return elementIds
        .map((id) => elementsMap.get(id))
        .filter((el): el is ExcalidrawElement => el !== undefined);
    },
  };

  return { state, actions };
}

function elementRef<T extends ExcalidrawElement = ExcalidrawElement>(
  id: string,
  elementsMap: Map<string, ExcalidrawElement>,
): ElementRef<T> {
  return {
    id,
    get element(): T {
      return ensureIsDefined(elementsMap.get(id)) as T;
    },
  };
}

function staticElementRef<T extends ExcalidrawElement = ExcalidrawElement>(
  element: T,
): ElementRef<T> {
  return {
    id: element.id,
    element,
  };
}
