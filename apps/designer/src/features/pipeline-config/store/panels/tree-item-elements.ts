import type { TreeItem, TreeItemIndex } from "react-complex-tree";

import type { ExcalidrawElement } from "@/features/excalidraw/types";

import { treeItemFactory } from "./tree-item-factory";
import type { TreeItemElementData, TreeItemElementsData } from "./types";

interface FactoryProps {
  itemId: string;
  treeItems: Record<TreeItemIndex, TreeItem>;
  elements: ExcalidrawElement[];
}

export function treeItemElementsFactory({
  itemId,
  elements,
  treeItems,
}: FactoryProps): TreeItemIndex {
  const elementsIndex = `${itemId}-elements`;
  const children: TreeItemIndex[] = [];

  for (const element of elements) {
    const index = `element-${element.id}`;
    children.push(index);

    treeItems[index] = treeItemFactory<TreeItemElementData>({
      index,
      data: {
        type: "canvas-element",
        title: element.type,
        element,
      },
    });
  }

  treeItems[elementsIndex] = treeItemFactory<TreeItemElementsData>({
    index: elementsIndex,
    children,
    isFolder: true,
    data: {
      type: "canvas-elements",
      title: "elements",
    },
  });

  return elementsIndex;
}
