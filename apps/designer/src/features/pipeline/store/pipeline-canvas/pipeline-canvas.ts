import type {
  SchemaNodeComponent,
  SchemaNodeDocumentStore,
} from "@/features/json-schema-reflection";
import {
  SchemaNodeTypes,
  schemaTypeReflection,
} from "@/features/json-schema-reflection";

import { skeletonFactory } from "../canvas-elements/skeletons/skeletons";
import type {
  ComponentExcalidrawElement,
  DocumentStoreExcalidrawElement,
} from "../canvas-elements/types";
import { storeContext } from "../store-context";

import type { PipelineCanvas } from "./types";

type CanvasPosition =
  | { clientX: number; clientY: number }
  | "cursor"
  | "center";

export function pipelineCanvasFactory(): PipelineCanvas {
  const { excalidrawStore, canvasElements } = storeContext.useX();

  const {
    state: { elementsStore, excalidraw, excalidrawActions },
  } = excalidrawStore;

  const {
    actions: { addElements: addElementsToCanvas },
  } = excalidraw;

  const {
    actions: { addStaged: addStagedElementsToStore },
  } = elementsStore;

  const { buildReflectionTree } = schemaTypeReflection;

  const { components, documentStores } = canvasElements.state;

  function addComponentFromSchema(
    schemaNode: SchemaNodeComponent,
    position: CanvasPosition,
  ): void {
    const skeletonElements = skeletonFactory<ComponentExcalidrawElement>({
      schema: schemaNode.schema,
    });
    const elementRefs = addStagedElementsToStore(skeletonElements);

    components.actions.createFromSchema(schemaNode, elementRefs, true);

    addElementsToCanvas(
      elementRefs.map((ref) => ref.element),
      position,
    );
  }

  function addDocumentStoreFromSchema(
    schemaNode: SchemaNodeDocumentStore,
    position: CanvasPosition,
  ): void {
    const skeletonElements = skeletonFactory<DocumentStoreExcalidrawElement>({
      schema: schemaNode.schema,
    });

    const elementRefs = addStagedElementsToStore(skeletonElements);

    documentStores.actions.createFromSchema(schemaNode, elementRefs, true);

    addElementsToCanvas(
      elementRefs.map((ref) => ref.element),
      position,
    );
  }

  const actions: PipelineCanvas["actions"] = {
    async addElementsFromSchema(schema, position) {
      if (excalidraw.state.isConnected) {
        const schemaNode = await buildReflectionTree(schema);

        switch (schemaNode.nodeType) {
          case SchemaNodeTypes.SchemaNodeComponent:
            addComponentFromSchema(schemaNode as SchemaNodeComponent, position);
            break;
          case SchemaNodeTypes.SchemaNodeDocumentStore:
            addDocumentStoreFromSchema(
              schemaNode as SchemaNodeDocumentStore,
              position,
            );
            break;
          default:
            throw new Error("Unknown nodeType");
        }
      }
    },

    canvasAction(name) {
      return excalidrawActions.getAction(name);
    },
  };

  return {
    actions,
  };
}
