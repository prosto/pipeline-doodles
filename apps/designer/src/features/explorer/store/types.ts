import type { NodeJsonSchema, SchemaBundle } from "@repo/node-specs/types";
import type {
  TreeDataProvider,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";

export interface TreeItemRoot {
  type: "root";
  title: "Root";
  canDrag: false;
}

export interface TreeItemSchema {
  type: "schema";
  title: string;
  schema: NodeJsonSchema;
  canDrag: true;
}

export interface TreeItemSchemaBundle {
  type: "schema-bundle";
  title: string;
  bundle: SchemaBundle;
  canDrag: false;
}

export type TreeItemData =
  | { [key in string]: never }
  | TreeItemRoot
  | TreeItemSchema
  | TreeItemSchemaBundle;

export type PresetTreeItem = TreeItem<TreeItemData>;

export type PresetItems = Record<TreeItemIndex, PresetTreeItem>;

export interface PresetTreeViewState {
  selectedItems: TreeItemIndex[];
  expandedItems: TreeItemIndex[];
  focusedItem?: TreeItemIndex;
}

export interface Preset {
  state: {
    id: string;
    title: string;
    items: PresetItems;
    rootItem: string;
    viewState: PresetTreeViewState;
  };
  actions: {
    collapseItem: (item: PresetTreeItem) => void;
    expandItem: (item: PresetTreeItem) => void;
    selectItems: (items: TreeItemIndex[]) => void;
    focusItem: (item: PresetTreeItem) => void;
    loadMissingItems: (items: TreeItemIndex[]) => void;
  };
}

export interface ExTreeDataProvider extends TreeDataProvider<TreeItemData> {
  getTreeItemSync: (itemId: TreeItemIndex) => PresetTreeItem;
}
