import { isObject } from "lodash-es";
import type { TreeItem } from "react-complex-tree";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import type {
  TreeItemData,
  TreeItemDataArray,
  TreeItemDataObject,
} from "./types";

export function isTreeItemDataObject(
  item: TreeItem<TreeItemData>,
): item is TreeItem<TreeItemDataObject> {
  return item.data.type === "schema-data-object";
}

export function isTreeItemDataArray(
  item: TreeItem<TreeItemData>,
): item is TreeItem<TreeItemDataArray> {
  return item.data.type === "schema-data-array";
}

export function isSchemaNodeDescriptor(
  obj: unknown,
): obj is SchemaNodeDescriptor {
  return isObject(obj) && "nodeType" in obj;
}
