import { useId } from "react";
import { Tree, UncontrolledTreeEnvironment } from "react-complex-tree";
import { useSnapshot } from "valtio";

import { useConnectionsTree } from "../../hooks";
import { TreeItemArrow } from "../shared/tree-item-arrow";
import { TreeItemsContainer } from "../shared/tree-items-container";

import { TreeItemConnectionRender } from "./tree-item-render";

export function ConnectionsTree(): JSX.Element {
  const connectionsTree = useConnectionsTree();
  const {
    tree: { treeState, dataProvider },
    treeViewState,
  } = connectionsTree;

  const { viewState, changeHandlers } = treeViewState;
  const treeStateSnap = useSnapshot(treeState);

  const treeId = useId();

  if (!treeStateSnap.hasItems) {
    return (
      <p className="tw-text-xs tw-text-muted-foreground tw-my-2">
        Canvas has no connections
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
      renderItem={TreeItemConnectionRender}
      renderItemArrow={TreeItemArrow}
      renderItemsContainer={TreeItemsContainer}
      viewState={{
        [treeId]: viewState,
      }}
    >
      <Tree
        ref={(treeRef) => {
          if (treeRef) {
            connectionsTree.treeRef = treeRef;
          }
        }}
        rootItem="root"
        treeId={treeId}
        treeLabel="Connections Tree"
      />
    </UncontrolledTreeEnvironment>
  );
}
