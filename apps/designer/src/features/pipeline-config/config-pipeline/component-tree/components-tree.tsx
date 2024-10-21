import { useId } from "react";
import { Tree, UncontrolledTreeEnvironment } from "react-complex-tree";
import { useSnapshot } from "valtio";

import { useComponentsTree } from "../../hooks";
import { TreeItemArrow } from "../shared/tree-item-arrow";
import { TreeItemsContainer } from "../shared/tree-items-container";

import { TreeItemComponentRender } from "./tree-item-render";

export function ComponentsTree(): JSX.Element {
  const componentsTree = useComponentsTree();
  const {
    tree: { dataProvider, treeState },
    treeViewState: { viewState, changeHandlers },
  } = componentsTree;

  const treeStateSnap = useSnapshot(treeState);

  const treeId = useId();

  if (!treeStateSnap.hasComponents) {
    return (
      <p className="tw-text-xs tw-text-muted-foreground tw-my-2">
        Canvas has no components
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
      renderItem={TreeItemComponentRender}
      renderItemArrow={TreeItemArrow}
      renderItemsContainer={TreeItemsContainer}
      viewState={{
        [treeId]: viewState,
      }}
    >
      <Tree
        ref={(treeRef) => {
          if (treeRef) {
            componentsTree.treeRef = treeRef;
          }
        }}
        rootItem="root"
        treeId={treeId}
        treeLabel="Components Tree"
      />
    </UncontrolledTreeEnvironment>
  );
}
