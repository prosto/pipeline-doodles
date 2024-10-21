import { subscribe } from "valtio";

import { elementRefsFactory } from "@/features/excalidraw";
import type { ElementRef } from "@/features/excalidraw/store/types";
import type { PipelineDocumentStore } from "@/features/pipeline-graph/types";

import { canvasContext } from "../canvas-context";
import { bindDataToElements } from "../data-binding";
import type {
  DocumentStoreExcalidrawElement,
  PipelineDocumentStoreElement,
} from "../types";

interface ElementProps {
  elementRefs: ElementRef<DocumentStoreExcalidrawElement>[];
  documentStore: PipelineDocumentStore;
  isStaged?: boolean;
}

export function documentStoreElement({
  documentStore,
  elementRefs,
  isStaged,
}: ElementProps): PipelineDocumentStoreElement {
  const {
    excalidraw,
    excalidrawActions: { runAction },
  } = canvasContext.useX();

  const { id: documentStoreId } = documentStore.state;

  const state: PipelineDocumentStoreElement["state"] = {
    id: documentStoreId,
    documentStoreId,
    elementRefs: elementRefsFactory(elementRefs),
    documentStore,
    isStaged,
  };

  const documentStoreState = state.documentStore.state;

  function updateElementsData(): void {
    const elements = state.elementRefs.elements;
    const { name } = documentStoreState;

    bindDataToElements(elements, {
      state: documentStoreState,
    });

    excalidraw.actions.updateElementsInPlace({
      elementsOrIds: elements,
      updateData: {
        customData: {
          id: documentStoreId,
          name,
        },
      },
    });
  }

  subscribe(documentStoreState, updateElementsData);

  updateElementsData();

  return {
    state,
    actions: {
      detachElement(ref) {
        state.elementRefs.removeRef(ref);
        return state.elementRefs.refsCount();
      },

      attachElement(ref) {
        ref.element.customData.status = "ready";
        state.elementRefs.addRef(ref);
      },

      selectElements() {
        runAction("selectElements", state.elementRefs.elements);
      },
    },
  };
}
