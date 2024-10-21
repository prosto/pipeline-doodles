import { proxy } from "valtio";

import type { SchemaEditorHandle } from "@/features/json-schema-form";
import type { PipelineComponentElement } from "@/features/pipeline/store/canvas-elements/types";
import { storeContext } from "@/features/pipeline/store/store-context";
import type { ConnectionSocketWithState } from "@/features/pipeline-graph/types";
import { subscribeMap, subscribeSet } from "@/features/store-utils";

import type { PipelineInputsEditor } from "./types";

export function inputsDataEditorFactory(): PipelineInputsEditor {
  const {
    canvasElements,
    pipelineGraph: {
      state: { sockets },
    },
    pipelineData,
  } = storeContext.useX();

  const {
    state: { components: canvasComponents },
  } = canvasElements;

  const connectedSockets =
    sockets.getConnectedSockets<ConnectionSocketWithState>();

  const state: PipelineInputsEditor["state"] = proxy({
    hasInputs: false,
    schemasToEdit: [],
  });

  let editorAPI: SchemaEditorHandle;

  subscribeMap<string, PipelineComponentElement>(
    canvasComponents.state.components,
    {
      onAdded(_componentId, componentElement) {
        const { isStaged } = componentElement.state;

        if (isStaged) {
          return;
        }

        addComponentInputsToEdit(componentElement);

        state.hasInputs = true;
      },
    },
  );

  function updatePropertyVisibility(
    socket: ConnectionSocketWithState,
    visible: boolean,
  ): void {
    const { nodeName, name: propertyName } = socket;

    const {
      state: {
        context: {
          treeItems: {
            actions: { updateItemDataByKey },
          },
        },
      },
    } = editorAPI.getStore();

    updateItemDataByKey(nodeName, propertyName, {
      isHidden: visible,
    });
  }

  subscribeSet(connectedSockets, {
    onAdded(socket) {
      updatePropertyVisibility(socket, true);
    },

    onRemoved(socket) {
      updatePropertyVisibility(socket, false);
    },
  });

  function addComponentInputsToEdit(
    componentElement: PipelineComponentElement,
  ): void {
    const { name, schemaNode } = componentElement.state.node.state;

    const initialValue = pipelineData.actions.getData({
      pointer: {
        nodeName: name,
        nodeType: "components",
        paramsType: "input",
      },
    });

    state.schemasToEdit.push({
      schema: schemaNode.input,
      initialValue,
      name,
    });
  }

  return {
    state,

    actions: {
      setEditorAPI(handle) {
        editorAPI = handle;
      },
    },
  };
}
