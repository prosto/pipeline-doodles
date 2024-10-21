import { useId } from "react";
import { Tree, UncontrolledTreeEnvironment } from "react-complex-tree";
import { useSnapshot } from "valtio";

import { useDocumentStoresTree } from "../../hooks";
import { TreeItemArrow } from "../shared/tree-item-arrow";
import { TreeItemsContainer } from "../shared/tree-items-container";

import { ComponentTreeItemRender } from "./tree-item-render";

export function DocumentStoreTree(): JSX.Element {
  const documentStoresTree = useDocumentStoresTree();

  const {
    treeViewState,
    tree: { dataProvider, treeState },
  } = documentStoresTree;

  const { viewState, changeHandlers } = treeViewState;

  const treeId = useId();
  const treeStateSnap = useSnapshot(treeState);

  if (!treeStateSnap.hasItems) {
    return (
      <p className="tw-text-xs tw-text-muted-foreground tw-my-2">
        Canvas has no document stores
      </p>
    );
  }

  return (
    <UncontrolledTreeEnvironment
      dataProvider={dataProvider}
      {...changeHandlers}
      canSearch={false}
      canSearchByStartingTyping={false}
      getItemTitle={() => "title"}
      renderItem={ComponentTreeItemRender}
      renderItemArrow={TreeItemArrow}
      renderItemsContainer={TreeItemsContainer}
      viewState={{
        [treeId]: viewState,
      }}
    >
      <Tree
        ref={(treeRef) => {
          if (treeRef) {
            documentStoresTree.treeRef = treeRef;
          }
        }}
        rootItem="root"
        treeId={treeId}
        treeLabel="Document Store Tree"
      />
    </UncontrolledTreeEnvironment>
  );
}
