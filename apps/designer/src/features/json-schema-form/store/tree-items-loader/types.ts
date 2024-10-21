import type {
  SchemaTreeItem,
  TreeItemDataArray,
  TreeItemDataObject,
} from "../types";

export interface ObjectLoaderOptions {
  item: SchemaTreeItem<TreeItemDataObject>;
  hideOptional?: boolean;
  includeOptional?: string[];
  include?: string[];
  hideDefaults?: boolean;
}

export interface TreeItemsObjectLoader {
  loadObjectTreeItems: (
    options: ObjectLoaderOptions,
  ) => Promise<SchemaTreeItem[]>;
}

export interface ArrayLoaderOptions {
  item: SchemaTreeItem<TreeItemDataArray>;
}

export interface TreeItemsArrayLoader {
  loadArrayTreeItems: (
    options: ArrayLoaderOptions,
  ) => Promise<SchemaTreeItem[]>;
}
