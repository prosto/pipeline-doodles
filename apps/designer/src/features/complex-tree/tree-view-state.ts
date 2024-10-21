import type {
  IndividualTreeViewState,
  TreeChangeHandlers,
} from "react-complex-tree";
import { proxy } from "valtio";

import type { TreeViewState } from "./types";

export function treeViewStateFactory(): TreeViewState {
  const viewState: IndividualTreeViewState = proxy({
    focusedItem: undefined,
    expandedItems: [],
    selectedItems: [],
  });

  const changeHandlers: TreeChangeHandlers = {
    onFocusItem(item) {
      viewState.focusedItem = item.index;
    },
    onExpandItem(item) {
      viewState.expandedItems?.push(item.index);
    },
    onCollapseItem(item) {
      viewState.expandedItems = viewState.expandedItems?.filter(
        (expandedItemIndex) => expandedItemIndex !== item.index,
      );
    },

    onSelectItems(items) {
      viewState.selectedItems = items;
    },
  };

  return { viewState, changeHandlers };
}
