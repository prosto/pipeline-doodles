import type { TreeItemIndex } from "react-complex-tree";

import { useTreeItemContext } from "../providers";
import type {
  SchemaTreeItem,
  TreeItemData,
  TreeItemRenderProps,
} from "../store/types";

import { useSchemaEditorStoreContext } from "./use-schema-editor";

export function useTreeItemById(itemId: TreeItemIndex): SchemaTreeItem {
  const {
    treeItems: {
      actions: { getTreeItem },
    },
  } = useSchemaEditorStoreContext();
  return getTreeItem(itemId);
}

export function useTreeItem<T extends TreeItemData>(): SchemaTreeItem<T> {
  const ctx = useTreeItemContext();
  return ctx.state.treeItem as SchemaTreeItem<T>;
}

export function useTreeItemData<T extends TreeItemData>(): T {
  const ctx = useTreeItemContext();
  return ctx.state.treeItem.data as T;
}

export function useTreeItemRenderProps<
  T extends TreeItemData,
>(): TreeItemRenderProps<T> {
  const ctx = useTreeItemContext();
  return ctx.state.renderProps as TreeItemRenderProps<T>;
}

export function useTreeItemOffset(startOffset = 0): string {
  const { depth } = useTreeItemRenderProps();
  const containerDepth = depth + startOffset;

  return `${containerDepth > 1 ? containerDepth + 14 : 0}px`;
}
