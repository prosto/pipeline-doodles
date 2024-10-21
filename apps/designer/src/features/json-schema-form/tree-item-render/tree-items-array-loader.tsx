import { useEffect, type PropsWithChildren, type ReactNode } from "react";

import { useSchemaTree, useTreeItem } from "../hooks";
import type { TreeItemDataArray } from "../store/types";

export function TreeItemsArrayLoader({
  children,
}: PropsWithChildren): ReactNode {
  const {
    actions: { loadArrayTreeItems },
  } = useSchemaTree();

  const treeItem = useTreeItem<TreeItemDataArray>();

  const loadingState = treeItem.data.loadingState;

  useEffect(() => {
    async function loadTreeItems(): Promise<void> {
      loadingState.isLoading = true;

      await loadArrayTreeItems({
        item: treeItem,
      });

      loadingState.isLoading = false;
      loadingState.isLoaded = true;
    }

    if (!loadingState.isLoading && !loadingState.isLoaded) {
      void loadTreeItems();
    }
  }, [loadArrayTreeItems, treeItem, loadingState]);

  return children;
}
