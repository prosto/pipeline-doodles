import { ensureIsDefined, mapOfSets } from "@repo/shared/utils";
import { proxyMap } from "valtio/utils";

import type { ElementRef } from "@/features/excalidraw/store/types";
import type { ExcalidrawElement } from "@/features/excalidraw/types";
import {
  schemaTypeReflection,
  type SchemaNodeDocumentStore,
} from "@/features/json-schema-reflection";

import { canvasContext } from "./canvas-context";
import type { DocumentStoreElementWrapper } from "./element-wrappers/types";
import { documentStoreElement } from "./elements/document-store-element";
import type {
  CanvasDocumentStores,
  DocumentStoreExcalidrawElement,
  PipelineDocumentStoreElement,
} from "./types";

export function canvasDocumentStoreFactory(): CanvasDocumentStores {
  const { pipelineGraph } = canvasContext.useX();
  const createDocumentStoreElement = canvasContext.wrapFn(documentStoreElement);

  const documentStores = proxyMap<
    PipelineDocumentStoreElement["state"]["id"],
    PipelineDocumentStoreElement
  >();

  const elementToStore = new Map<
    ExcalidrawElement["id"],
    PipelineDocumentStoreElement["state"]["id"]
  >();

  const state = {
    documentStores,
  };

  function removeDocumentStore(
    documentStore: PipelineDocumentStoreElement,
  ): void {
    const { id: componentId, documentStoreId } = documentStore.state;
    documentStores.delete(componentId);
    pipelineGraph.actions.removeDocumentStore(documentStoreId);
  }

  function addElementRefToComponent(
    documentStoreId: string,
    ref: ElementRef<DocumentStoreExcalidrawElement>,
  ): void {
    const ds = documentStores.get(documentStoreId);
    if (ds) {
      ds.actions.attachElement(ref);
      elementToStore.set(ref.id, documentStoreId);
    }
  }

  const actions: CanvasDocumentStores["actions"] = {
    createFromSchema(
      schemaNode: SchemaNodeDocumentStore,
      elementRefs: ElementRef<DocumentStoreExcalidrawElement>[],
      isStaged = false,
    ): PipelineDocumentStoreElement {
      const documentStore = pipelineGraph.actions.addDocumentStore(schemaNode);

      const newDocumentStore = createDocumentStoreElement({
        documentStore,
        elementRefs,
        isStaged,
      });
      const documentStoreId = newDocumentStore.state.id;

      documentStores.set(documentStoreId, newDocumentStore);
      elementRefs.forEach(({ id }) => elementToStore.set(id, documentStoreId));

      return newDocumentStore;
    },

    handleAdded(elementWrappers: DocumentStoreElementWrapper[]): void {
      const elementsBySchemaAndId = mapOfSets<
        string,
        ElementRef<DocumentStoreExcalidrawElement>
      >();

      for (const wrapper of elementWrappers) {
        const { customId, elementId, status, schemaId } = wrapper;
        if (
          customId &&
          documentStores.has(customId) &&
          !elementToStore.has(elementId) &&
          (status === "staged" || status === "attach")
        ) {
          addElementRefToComponent(customId, wrapper.elementRef);
        } else {
          const dataKey = `${schemaId}:::${customId}`;
          elementsBySchemaAndId.addValue(dataKey, wrapper.elementRef);
        }
      }

      for (const [dataKey, refs] of elementsBySchemaAndId.normEntries()) {
        const [schemaId] = dataKey.split(":::");

        void schemaTypeReflection
          .buildReflectionTree(schemaId)
          .then((schemaNode) =>
            actions.createFromSchema(
              schemaNode as SchemaNodeDocumentStore,
              refs,
            ),
          );
      }
    },

    handleUpdated(_elementWrappers: DocumentStoreElementWrapper[]): void {
      // TODO
    },

    handleDeleted(_elementWrappers: DocumentStoreElementWrapper[]): void {
      // TODO
    },

    handleRemoved(elementWrappers: DocumentStoreElementWrapper[]): void {
      for (const { elementRef, elementId } of elementWrappers) {
        const documentStoreId = elementToStore.get(elementId);
        if (documentStoreId && documentStores.has(documentStoreId)) {
          const documentStore = ensureIsDefined(
            documentStores.get(documentStoreId),
          );
          if (documentStore.actions.detachElement(elementRef) <= 0) {
            removeDocumentStore(documentStore);
          }
          elementToStore.delete(elementRef.id);
        }
      }
    },
  };

  return {
    state,
    actions,
  };
}
