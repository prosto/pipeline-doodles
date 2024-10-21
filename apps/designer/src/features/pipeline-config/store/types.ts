import type { TreeRef } from "react-complex-tree";

import type { TreeViewState } from "@/features/complex-tree/types";
import type { SchemaEditorHandle } from "@/features/json-schema-form";
import type { TopLevelSchema } from "@/features/json-schema-form/store/types";
import type { ConnectionSocket } from "@/features/pipeline-graph/types";

import type {
  ComponentTree,
  ConnectionTree,
  DocumentStoreTree,
} from "./panels/types";

export interface PipelineInputsEditor {
  state: {
    hasInputs: boolean;
    schemasToEdit: TopLevelSchema[];
  };

  actions: {
    setEditorAPI: (handle: SchemaEditorHandle) => void;
  };
}

export type PipelineConfigView = "config-view-canvas" | "config-view-selected";

export interface PipelinePanel {
  components: {
    treeRef?: TreeRef;
    tree: ComponentTree;
    treeViewState: TreeViewState;
  };
  connections: {
    treeRef?: TreeRef;
    tree: ConnectionTree;
    treeViewState: TreeViewState;
  };
  documentStores: {
    treeRef?: TreeRef;
    tree: DocumentStoreTree;
    treeViewState: TreeViewState;
  };
  inputsEditor: PipelineInputsEditor;
}

interface EditingConnectionPanel {
  socketPairs: [ConnectionSocket, ConnectionSocket, boolean][];
}

interface PipelineConfigPanels {
  pipeline: PipelinePanel;
  editingConnection: EditingConnectionPanel;
}

export interface PipelineConfig {
  state: {
    active: PipelineConfigView;
    panels: PipelineConfigPanels;
  };
  actions: {
    setActive: (config: PipelineConfigView) => void;
  };
}
