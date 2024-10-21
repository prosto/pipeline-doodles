import { useSingleton } from "@repo/ui/hooks";

import { storeContext } from "../store/store-context";
import type { TreeItemObjectControls } from "../store/tree-item-controls";
import { treeItemObjectControlsFactory } from "../store/tree-item-controls";
import type { TreeItemDataObject } from "../store/types";

import { useSchemaEditorStoreContext } from "./use-schema-editor";
import { useTreeItem } from "./use-tree-item";

export function useObjectControlsStore(): TreeItemObjectControls {
  const treeItem = useTreeItem<TreeItemDataObject>();
  const context = useSchemaEditorStoreContext();

  const controls = useSingleton(() =>
    storeContext.run(context, () =>
      treeItemObjectControlsFactory({ treeItem }),
    ),
  );

  return controls;
}
