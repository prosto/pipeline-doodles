import type {
  IndividualTreeViewState,
  StaticTreeDataProvider,
  TreeChangeHandlers,
  TreeItemIndex,
} from "react-complex-tree";

export interface TreeViewState {
  viewState: IndividualTreeViewState;
  changeHandlers: TreeChangeHandlers;
}

export interface TreeDataProvider<T> {
  dataProvider: StaticTreeDataProvider<T>;
  notifyChanges: (...indexes: (TreeItemIndex | undefined)[]) => void;
}
