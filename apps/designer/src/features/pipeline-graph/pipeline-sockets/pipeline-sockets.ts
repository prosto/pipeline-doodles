import type { MapOfSets } from "@repo/shared/utils";
import { ensureIsDefined, isDefined, mapOfSets } from "@repo/shared/utils";
import { proxy } from "valtio";
import { derive, proxySet } from "valtio/utils";

import type { SchemaNodeObject } from "@/features/json-schema-reflection";

import { pipelineGraphContext } from "../pipeline-graph-context";
import type { PipelineComponent, PipelineConnection } from "../types";

import { matchingSocketsView } from "./matching-sockets-view";
import { socketKey } from "./pipeline-socket-key";
import { compatibleNodes } from "./schema-node-compatibility";
import type {
  ConnectionSocket,
  ConnectionSocketKey,
  MatchingSocketsView,
  PipelineSockets,
  SocketType,
  SocketConnectedState,
  SocketNodeId,
} from "./types";

export function pipelineSocketsFactory(): PipelineSockets {
  const { components } = pipelineGraphContext.useX();

  const socketsStore = new Map<ConnectionSocketKey, ConnectionSocket>();
  const connectedSockets = proxySet<ConnectionSocket>();
  const matchingSockets = matchingSocketsView();

  const connectedSocketPairs = {
    sourceToTargets: mapOfSets<ConnectionSocket, ConnectionSocket>(),
    targetToSources: mapOfSets<ConnectionSocket, ConnectionSocket>(),
  };

  const socketsForNode: {
    init: MapOfSets<SocketNodeId, ConnectionSocket>;
    input: MapOfSets<SocketNodeId, ConnectionSocket>;
    output: MapOfSets<SocketNodeId, ConnectionSocket>;
  } = {
    init: mapOfSets(),
    input: mapOfSets(),
    output: mapOfSets(),
  };

  function logMatchingNodes(_msg: string): void {
    // console.log(msg, "   > sockets:", matchingSockets);
  }

  function addSocketForNode(
    type: SocketType,
    nodeId: SocketNodeId,
    socket: ConnectionSocket,
  ): void {
    socketsForNode[type].addValue(nodeId, socket);
  }

  function findSchemaCompatibleSockets(
    socket: ConnectionSocket,
    targetSockets: ConnectionSocket[],
  ): ConnectionSocket[] {
    return targetSockets.filter((targetSocket) =>
      compatibleNodes(socket.schemaNode, targetSocket.schemaNode),
    );
  }

  function onNodeRemoved(node: PipelineComponent): void {
    const { id: nodeId } = node.state;

    const inputSockets = socketsForNode.input.getValueOrDefault(nodeId);
    const outputSockets = socketsForNode.output.getValueOrDefault(nodeId);
    const allSockets = [...inputSockets, ...outputSockets];

    socketsForNode.input.delete(nodeId);
    socketsForNode.output.delete(nodeId);

    matchingSockets.removeSocketsForNode(nodeId);

    for (const socketToRemove of allSockets) {
      matchingSockets.removeSocket(socketToRemove);
      socketsStore.delete(socketToRemove.key);
    }
    logMatchingNodes("onNodeRemoved");
  }

  function addSocketsForDirection(
    type: SocketType,
    nodeId: SocketNodeId,
    schemaNodeObject: SchemaNodeObject,
  ): void {
    for (const { propertyName } of schemaNodeObject.properties) {
      const sourceSocket = createSocket(type, nodeId, propertyName);
      socketsStore.set(sourceSocket.key, sourceSocket);

      addSocketForNode(type, nodeId, sourceSocket);

      const connectingNodes =
        type === "input" ? socketsForNode.output : socketsForNode.input;

      for (const [
        connectingNodeId,
        connectingSockets,
      ] of connectingNodes.normEntries()) {
        if (nodeId !== connectingNodeId) {
          const compatibleMatches = findSchemaCompatibleSockets(
            sourceSocket,
            connectingSockets,
          );
          if (compatibleMatches.length > 0) {
            matchingSockets.addMatching(
              sourceSocket,
              connectingNodeId,
              compatibleMatches,
            );
            compatibleMatches.forEach((socket) => {
              matchingSockets.addMatching(socket, nodeId, [sourceSocket]);
            });
          }
        }
      }
    }
  }

  function onNewComponentAdded(component: PipelineComponent): void {
    const { id: nodeId, schemaNode } = component.state;

    addSocketsForDirection("output", nodeId, schemaNode.output);
    addSocketsForDirection("input", nodeId, schemaNode.input);
  }

  function onConnectionAdded(connection: PipelineConnection): void {
    const { source, target } = connection.state;
    connectedSockets.add(source).add(target);

    connectedSocketPairs.sourceToTargets.addValue(source, target);
    connectedSocketPairs.targetToSources.addValue(target, source);
  }

  function onConnectionRemoved(connection: PipelineConnection): void {
    const { source, target } = connection.state;
    connectedSockets.delete(source);
    connectedSockets.delete(target);

    connectedSocketPairs.sourceToTargets.removeValue(source, target);
    connectedSocketPairs.targetToSources.removeValue(target, source);
  }

  function getSocketsForNode(
    type: SocketType,
    nodeId: SocketNodeId,
  ): Set<ConnectionSocket> {
    return socketsForNode[type].getValueOrDefault(nodeId);
  }

  function getSocketForNode<T extends ConnectionSocket>(
    type: SocketType,
    nodeId: SocketNodeId,
    name: string,
  ): T | undefined {
    return socketsStore.get(socketKey(type, nodeId, name)) as T | undefined;
  }

  function getMatchingSocketsForNode(
    type: SocketType,
    nodeId: SocketNodeId,
  ): MatchingSocketsView {
    const socketsToMatch = getSocketsForNode(type, nodeId);
    return matchingSockets.getMatchingSockets(...socketsToMatch);
  }

  function createSocket(
    type: SocketType,
    nodeId: SocketNodeId,
    name: string,
  ): ConnectionSocket {
    const socket: ConnectionSocket = proxy({
      nodeId,
      type,
      name,

      get key() {
        return socketKey(type, nodeId, name);
      },

      get node() {
        return ensureIsDefined(components.get(nodeId));
      },

      get nodeName() {
        return socket.node.state.name;
      },

      get schemaNode() {
        const propertySchemaNode =
          socket.node.state.schemaNode[type].getPropertyByName(name);

        return ensureIsDefined(propertySchemaNode);
      },

      get variadic() {
        return socket.schemaNode.variadic;
      },

      get canConnect() {
        return socket.variadic || !connectedSockets.has(socket);
      },

      toString() {
        return this.key;
      },
    });

    Object.assign(socket, {
      connectedState: socketConnectedState(socket),
    });

    return socket;
  }

  function socketConnectedState(
    socket: ConnectionSocket,
  ): SocketConnectedState {
    return derive({
      isConnected: (get) => get(connectedSockets).has(socket),

      connectedSockets: (get) => {
        if (get(connectedSockets).has(socket)) {
          const { sourceToTargets, targetToSources } = connectedSocketPairs;

          if (sourceToTargets.map.has(socket)) {
            return [...sourceToTargets.getValueOrDefault(socket, new Set())];
          }

          if (targetToSources.map.has(socket)) {
            return [...targetToSources.getValueOrDefault(socket, new Set())];
          }
        }

        return [];
      },
    });
  }

  function getOrCreateSocket(
    type: SocketType,
    nodeId: SocketNodeId,
    name: string,
  ): ConnectionSocket {
    return (
      getSocketForNode(type, nodeId, name) ?? createSocket(type, nodeId, name)
    );
  }

  function sameSocket(
    socket1?: ConnectionSocket | null,
    socket2?: ConnectionSocket | null,
  ): boolean {
    return (
      isDefined(socket1) && isDefined(socket2) && socket1.key === socket2.key
    );
  }

  function getConnectedSockets<T extends ConnectionSocket>(): Set<T> {
    return connectedSockets as unknown as Set<T>;
  }

  return {
    onNewComponentAdded,
    onNodeRemoved,
    onConnectionAdded,
    onConnectionRemoved,
    getMatchingSocketsForNode,
    createSocket,
    getOrCreateSocket,
    getSocketForNode,
    getConnectedSockets,
    sameSocket,
  };
}
