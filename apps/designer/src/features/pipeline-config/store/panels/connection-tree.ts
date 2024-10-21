import type { TreeItemIndex } from "react-complex-tree";
import { proxy } from "valtio";

import { treeDataProviderFactory } from "@/features/complex-tree/tree-data-provider";
import type { PipelineConnectionElement } from "@/features/pipeline/store/canvas-elements/types";
import { storeContext } from "@/features/pipeline/store/store-context";
import type { ConnectionSocket } from "@/features/pipeline-graph/types";
import { subscribeMap } from "@/features/store-utils";

import { treeItemElementsFactory } from "./tree-item-elements";
import { treeItemFactory, treeItemsWrapper } from "./tree-item-factory";
import type {
  ConnectionTree,
  ConnectionTreeItemData,
  ConnectionTreeItems,
  TreeItemConnectionData,
  TreeItemConnectionSocketData,
  TreeItemRoot,
} from "./types";

export function connectionTreeItemsFactory(): ConnectionTree {
  const { canvasElements } = storeContext.useX();

  const {
    state: { connections: canvasConnections },
  } = canvasElements;

  const treeItems: ConnectionTreeItems = proxy({});
  const wrapper = treeItemsWrapper(treeItems);

  const { dataProvider, notifyChanges } =
    treeDataProviderFactory<ConnectionTreeItemData>(treeItems);

  const treeState = proxy({
    hasItems: false,
  });

  treeItems.root = treeItemFactory<TreeItemRoot>({
    index: "root",
    children: [],
    isFolder: true,
    data: {
      type: "root",
      title: "Connections",
    },
  });

  subscribeMap<string, PipelineConnectionElement>(
    canvasConnections.state.connections,
    {
      onAdded(connectionId, connectionElement) {
        createConnectionTreeItems(connectionElement);
        notifyChanges(connectionId);

        treeState.hasItems = true;
      },
    },
  );

  function createConnectionTreeItems(
    connectionElement: PipelineConnectionElement,
  ): void {
    const { connection, arrowElement } = connectionElement.state;
    const {
      source: { nodeName: senderNodeName, name: senderName },
      target: { nodeName: receiverNodeName, name: receiverName },
      id: connectionId,
    } = connection.state;

    const senderIndex = socketItems(connection.state.source);
    const receiverIndex = socketItems(connection.state.target);

    const elementIndex = treeItemElementsFactory({
      itemId: connectionId,
      elements: [arrowElement],
      treeItems,
    });

    const treeItem = treeItemFactory<TreeItemConnectionData>({
      index: connectionId,
      children: [senderIndex, receiverIndex, elementIndex],
      isFolder: true,
      data: {
        type: "connection",
        title: `${senderNodeName}.${senderName} -> ${receiverNodeName}.${receiverName}`,
        connection: connectionElement,
      },
    });

    wrapper.addTreeItems([treeItem]);
  }

  function socketItems(socket: ConnectionSocket): TreeItemIndex {
    const index = socket.key;
    treeItems[index] = treeItemFactory<TreeItemConnectionSocketData>({
      index: socket.key,
      data: {
        type: "connection-socket",
        title: `Node: ${socket.nodeName} | Property: ${socket.name}`,
        socket,
      },
    });

    return index;
  }

  return { treeItems, treeState, dataProvider };
}
