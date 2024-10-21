import type { TreeItem, TreeItemIndex } from "react-complex-tree";

interface GenericTreeItemData {
  type: string;
}

export function treeItemFactory<T extends GenericTreeItemData>(
  treeItemProps: TreeItem<T> = {
    index: "root",
    children: [],
    isFolder: false,
    canMove: false,
    canRename: false,
    data: { type: "root" } as T,
  },
): TreeItem<T> {
  return treeItemProps;
}

interface TreeItemsWrapper {
  addTreeItems: (
    items: TreeItem[],
    parentIndex?: TreeItemIndex,
  ) => TreeItemIndex;
}

export function treeItemsWrapper(
  treeItems: Record<TreeItemIndex, TreeItem>,
): TreeItemsWrapper {
  return {
    addTreeItems(items, parentIndex = "root") {
      for (const item of items) {
        treeItems[item.index] = item;
        const parent = treeItems[parentIndex];
        parent.children?.push(item.index);
      }

      return parentIndex;
    },
  };
}
