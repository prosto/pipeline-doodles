import type {
  StaticTreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";

import type { ExcalidrawElement } from "@/features/excalidraw/types";
import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";
import type {
  PipelineConnectionElement,
  PipelineDocumentStoreElement,
  PipelineComponentElement,
} from "@/features/pipeline/store/canvas-elements/types";
import type {
  ConnectionSocket,
  ConnectionSocketWithState,
  PipelineDataPointer,
} from "@/features/pipeline-graph/types";

export interface TreeItemRoot {
  type: "root";
  title: string;
}

export interface TreeItemComponentData {
  type: "component";
  title: string;
  component: PipelineComponentElement;
}

export interface TreeItemEditorData {
  type: "editor-data";
  title: string;
  schemaNode: SchemaNodeDescriptor;
  dataPointer: PipelineDataPointer;
  editorState: {
    canEdit?: boolean;
    isEditing?: boolean;
  };
}

export interface TreeItemPropertyData {
  name: string;
  pyType?: string;
}

export interface TreeItemComponentPropertyData extends TreeItemPropertyData {
  type: "component-property";
  socket?: ConnectionSocketWithState;
}

export interface TreeItemDocumentStorePropertyData
  extends TreeItemPropertyData {
  type: "document-store-property";
}

export interface TreeItemElementsData {
  type: "canvas-elements";
  title: string;
}

export interface TreeItemElementData {
  type: "canvas-element";
  title: string;
  element: ExcalidrawElement;
}

export type ComponentTreeItemData =
  | TreeItemRoot
  | TreeItemComponentData
  | TreeItemEditorData
  | TreeItemComponentPropertyData
  | TreeItemElementsData
  | TreeItemElementData;

export interface TreeItemConnectionData {
  type: "connection";
  title: string;
  connection: PipelineConnectionElement;
}

export interface TreeItemConnectionSocketData {
  type: "connection-socket";
  title: string;
  socket: ConnectionSocket;
}

export type ConnectionTreeItemData =
  | TreeItemRoot
  | TreeItemConnectionData
  | TreeItemConnectionSocketData
  | TreeItemElementsData
  | TreeItemElementData;

export interface TreeItemDocumentStoreData {
  type: "document-store";
  title: string;
  documentStore: PipelineDocumentStoreElement;
}

export type DocumentStoreTreeItemData =
  | TreeItemRoot
  | TreeItemDocumentStoreData
  | TreeItemEditorData
  | TreeItemDocumentStorePropertyData
  | TreeItemElementsData
  | TreeItemElementData;

export type ComponentTreeItems = Record<TreeItemIndex, TreeItem>;

export type ConnectionTreeItems = Record<
  TreeItemIndex,
  TreeItem<ConnectionTreeItemData>
>;

export type DocumentStoreTreeItems = Record<TreeItemIndex, TreeItem>;

export interface ComponentTree {
  treeItems: ComponentTreeItems;
  dataProvider: StaticTreeDataProvider<ComponentTreeItemData>;
  treeState: {
    hasComponents: boolean;
  };
}

export interface DocumentStoreTree {
  treeItems: DocumentStoreTreeItems;
  dataProvider: StaticTreeDataProvider<DocumentStoreTreeItemData>;
  treeState: {
    hasItems: boolean;
  };
}

export interface ConnectionTree {
  treeItems: ConnectionTreeItems;
  dataProvider: StaticTreeDataProvider<ConnectionTreeItemData>;
  treeState: {
    hasItems: boolean;
  };
}
