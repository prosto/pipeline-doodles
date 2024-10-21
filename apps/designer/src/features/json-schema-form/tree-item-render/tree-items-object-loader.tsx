import { useEffect, type PropsWithChildren, type ReactNode } from "react";

import { useSchemaTree, useTreeItem } from "../hooks";
import type { ObjectLoaderOptions } from "../store/tree-items-loader/types";
import type { TreeItemDataObject } from "../store/types";

type TreeItemsObjectLoaderProps = Omit<ObjectLoaderOptions, "item">;

export function TreeItemsObjectLoader({
  children,
  ...loadOptions
}: PropsWithChildren<TreeItemsObjectLoaderProps>): ReactNode {
  const {
    actions: { loadObjectTreeItems },
  } = useSchemaTree();

  const treeItem = useTreeItem<TreeItemDataObject>();
  const loadingState = treeItem.data.loadingState;

  useEffect(() => {
    async function loadTreeItems(): Promise<void> {
      loadingState.isLoading = true;

      await loadObjectTreeItems({
        item: treeItem,
        ...loadOptions,
      });

      loadingState.isLoading = false;
      loadingState.isLoaded = true;
    }

    if (!loadingState.isLoading && !loadingState.isLoaded) {
      void loadTreeItems();
    }
  }, [loadObjectTreeItems, treeItem, loadingState, loadOptions]);

  return children;
}
