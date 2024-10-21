import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import get from "lodash-es/get";
import mapValues from "lodash-es/mapValues";

import type { ElementUpdate, ExcalidrawAPI } from "./types";

type RestoreFn = () => void;
export type ElementsFilter = (element: ExcalidrawElement) => boolean;
export interface ElementsUpdater {
  update: (
    elementIds: ExcalidrawElement["id"][],
    updateData?: ElementUpdate,
  ) => () => void;

  restoreAll: RestoreFn;
  restoreOriginal: RestoreFn;
}

const defaultFilter = (_element: ExcalidrawElement): boolean => true;

interface ElementsUpdaterProps {
  excalidraw: ExcalidrawAPI;
  defaultUpdateData?: ElementUpdate;
  elementsFilter?: ElementsFilter;
  changeVersion?: boolean;
  commitToHistory?: boolean;
}

export function elementsUpdater({
  excalidraw,
  defaultUpdateData,
  elementsFilter = defaultFilter,
  changeVersion = false,
  commitToHistory = false,
}: ElementsUpdaterProps): ElementsUpdater {
  const { updateElements, getElements } = excalidraw.actions;

  const originalRestoreBuffer = new Set<() => void>();
  const restoreBuffer = new Set<() => void>();

  function update(
    elementIds: ExcalidrawElement["id"][],
    updateData = defaultUpdateData,
  ): RestoreFn {
    if (!updateData) {
      throw new Error("You should provide updateData");
    }

    const elementsToUpdate = getElements(elementIds).filter(elementsFilter);

    const dataBeforeUpdate: [string, ElementUpdate][] = elementsToUpdate.map(
      (element) => {
        const oldData: ElementUpdate = mapValues(updateData, (_value, key) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Known keys
          get(element, key),
        );
        return [element.id, oldData];
      },
    );

    updateElements({
      elementIds: elementsToUpdate.map((ref) => ref.id),
      updateData,
      changeVersion,
      commitToHistory,
    });

    const restoreElements: RestoreFn = () => {
      updateElements({
        updates: Object.fromEntries<ElementUpdate>(dataBeforeUpdate),
        changeVersion,
        commitToHistory,
      });
      restoreBuffer.delete(restoreElements);
    };

    if (restoreBuffer.size === 0) {
      originalRestoreBuffer.add(restoreElements);
    }

    restoreBuffer.add(restoreElements);

    return restoreElements;
  }

  function restoreAll(): void {
    restoreBuffer.forEach((restoreElements) => {
      restoreElements();
    });
  }

  function restoreOriginal(): void {
    if (restoreBuffer.size > 0) {
      const [firstRestore] = restoreBuffer;
      firstRestore();
      restoreBuffer.clear();
    }
  }

  return {
    update,
    restoreAll,
    restoreOriginal,
  };
}
