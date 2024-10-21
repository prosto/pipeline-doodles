import { useSingleton } from "@repo/ui/hooks";

import { storeContext } from "../store/store-context";
import type { TreeItemArrayControls } from "../store/tree-item-controls";
import { treeItemArrayControlsFactory } from "../store/tree-item-controls";
import type { TreeItemDataArray } from "../store/types";

import { useSchemaEditorStoreContext } from "./use-schema-editor";
import { useTreeItem } from "./use-tree-item";

export function useArrayControlsStore(): TreeItemArrayControls {
  const treeItem = useTreeItem<TreeItemDataArray>();
  const context = useSchemaEditorStoreContext();

  const controls = useSingleton(() =>
    storeContext.run(context, () => treeItemArrayControlsFactory({ treeItem })),
  );

  return controls;
}
