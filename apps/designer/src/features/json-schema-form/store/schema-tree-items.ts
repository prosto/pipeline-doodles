import pull from "lodash-es/pull";
import unset from "lodash-es/unset";
import type { TreeItemIndex } from "react-complex-tree";
import { proxy } from "valtio";

import type { SchemaTreeItem, SchemaTreeItems, TreeItemData } from "./types";

export function schemaTreeItemsFactory(): SchemaTreeItems {
  const treeItems: Record<TreeItemIndex, SchemaTreeItem> = proxy({});

  function getTreeItem(
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
  ): SchemaTreeItem {
    return typeof treeItemOrIndex === "object"
      ? treeItemOrIndex
      : treeItems[treeItemOrIndex];
  }

  function getParentTreeItem(
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
  ): SchemaTreeItem {
    return getTreeItem(getTreeItem(treeItemOrIndex).data.parentIndex);
  }

  function getChildren(
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
  ): SchemaTreeItem[] {
    const treeItem = getTreeItem(treeItemOrIndex);
    const childIndexes = treeItem.children ?? [];

    return childIndexes.map((index) => getTreeItem(index));
  }

  function addTreeItem(
    treeItem: SchemaTreeItem,
    explicitParentIndex?: TreeItemIndex,
    pos?: number,
  ): SchemaTreeItem {
    const index = treeItem.index;
    treeItems[index] = treeItem;

    const parentIndex = explicitParentIndex ?? treeItem.data.parentIndex;
    addToParent(index, parentIndex, pos);

    return treeItem;
  }

  function addTreeItems(
    items: SchemaTreeItem[],
    explicitParentIndex?: TreeItemIndex,
  ): void {
    items.forEach((item) => addTreeItem(item, explicitParentIndex));
  }

  function addToParent(
    index: TreeItemIndex,
    parentIndex: TreeItemIndex,
    pos?: number,
  ): void {
    const parent = treeItems[parentIndex];
    parent.children = parent.children ?? [];
    if (pos) {
      parent.children.splice(pos, 0, index);
    } else {
      parent.children.push(index);
    }
  }

  function removeTreeItem(
    treeItemIndex: TreeItemIndex,
    parentIndex: TreeItemIndex,
  ): void {
    const { children } = treeItems[parentIndex];

    if (children) {
      pull(children, treeItemIndex);
    }

    unset(treeItems, treeItemIndex);
  }

  function isParentHidden(parentIndex: TreeItemIndex): boolean {
    const children = treeItems[parentIndex].children || [];

    if (children.length === 0) {
      return true;
    }

    for (const childIndex of children) {
      const childItem = treeItems[childIndex];
      if (!childItem.data.isHidden) {
        return false;
      }
    }

    return true;
  }

  function updateItemData<T extends TreeItemData>(
    index: TreeItemIndex,
    data: Partial<T>,
  ): void {
    Object.assign(treeItems[index].data, data);
  }

  function updateItemDataByKey<T extends TreeItemData>(
    parentIndex: TreeItemIndex,
    key: string,
    data: Partial<T>,
  ): void {
    const parentItem = treeItems[parentIndex];
    const children = parentItem.children || [];
    const treeItem = children
      .map((index) => treeItems[index])
      .find((item) => item.data.key === key);

    if (treeItem) {
      Object.assign(treeItem.data, data);
      Object.assign(parentItem.data, {
        isHidden: isParentHidden(parentIndex),
      });
    }
  }

  function getPosition(index: TreeItemIndex): number {
    const parentItem = getParentTreeItem(index);
    return parentItem.children?.indexOf(index) ?? -1;
  }

  return {
    state: {
      treeItems,
    },

    actions: {
      getTreeItem,

      getParentTreeItem,

      getChildren,

      getPosition,

      addTreeItem,

      addTreeItems,

      removeTreeItem,

      updateItemData,

      updateItemDataByKey,
    },
  };
}
