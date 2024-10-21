import { treeViewStateFactory } from "@/features/complex-tree/tree-view-state";

import { componentTreeItemsFactory } from "./panels/component-tree";
import { connectionTreeItemsFactory } from "./panels/connection-tree";
import { documentStoreTreeItemsFactory } from "./panels/document-store-tree";
import { inputsDataEditorFactory } from "./pipeline-inputs-editor";
import type { PipelineConfig, PipelineConfigView } from "./types";

export function pipelineConfigFactory(): PipelineConfig {
  const componentTree = componentTreeItemsFactory();

  const connectionsTree = connectionTreeItemsFactory();

  const documentStoreTree = documentStoreTreeItemsFactory();

  const inputsEditor = inputsDataEditorFactory();

  const panels: PipelineConfig["state"]["panels"] = {
    pipeline: {
      components: {
        tree: componentTree,
        treeViewState: treeViewStateFactory(),
      },

      connections: {
        tree: connectionsTree,
        treeViewState: treeViewStateFactory(),
      },

      documentStores: {
        tree: documentStoreTree,
        treeViewState: treeViewStateFactory(),
      },

      inputsEditor,
    },
    editingConnection: {
      socketPairs: [],
    },
  };

  const state: PipelineConfig["state"] = {
    active: "config-view-canvas",
    panels,
  };

  const actions: PipelineConfig["actions"] = {
    setActive(config: PipelineConfigView) {
      state.active = config;
    },
  };

  return {
    state,
    actions,
  };
}
