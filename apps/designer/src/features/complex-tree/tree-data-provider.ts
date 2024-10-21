import { isDefined } from "@repo/shared/utils";
import type { TreeItem, TreeItemIndex } from "react-complex-tree";
import { StaticTreeDataProvider } from "react-complex-tree";

import type { TreeDataProvider } from "./types";

export function treeDataProviderFactory<T>(
  treeItems: Record<TreeItemIndex, TreeItem<T>>,
): TreeDataProvider<T> {
  const dataProvider = new StaticTreeDataProvider(treeItems);

  function notifyChanges(...indexes: (TreeItemIndex | undefined)[]): void {
    void dataProvider.onDidChangeTreeDataEmitter.emit(
      indexes.filter(isDefined),
    );
  }

  return {
    dataProvider,
    notifyChanges,
  };
}
