import type { MapOfSets } from "@repo/shared/utils";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import type { PipelineComponent, PipelineConnection } from "../types";

export type SocketType = "init" | "input" | "output";

export interface ConnectionSocket {
  readonly nodeId: string;
  readonly name: string;
  readonly type: SocketType;

  readonly key: string;
  readonly schemaNode: SchemaNodeDescriptor;

  readonly node: PipelineComponent;
  readonly nodeName: string;
  readonly variadic: boolean;
  readonly canConnect: boolean;

  toString: () => string;
}
export type ConnectionSocketKey = ConnectionSocket["key"];
export type ConnectionSocketProps = Pick<ConnectionSocket, "name" | "nodeId">;

export interface SocketConnectedState {
  readonly isConnected: boolean;
  readonly connectedSockets: ConnectionSocket[];
}

export interface ConnectionSocketWithState extends ConnectionSocket {
  readonly connectedState: SocketConnectedState;
}

export type MatchingSocketsPerNode = MapOfSets<string, ConnectionSocket>;
export type MatchingSockets = Map<ConnectionSocket, MatchingSocketsPerNode>;

export type SocketPair = [ConnectionSocket, ConnectionSocket];

export type SocketNodeId = string;

export interface MatchingSocketsView {
  getSockets: () => MatchingSockets;

  addMatching: (
    sourceSocket: ConnectionSocket,
    connectingNodeId: SocketNodeId,
    targetSockets: ConnectionSocket[],
  ) => void;

  getMatchingNodes: () => SocketNodeId[];

  getMatchingSockets: (
    ...sourceSockets: ConnectionSocket[]
  ) => MatchingSocketsView;

  getMatchingNodesCached: () => SocketNodeId[];

  findBestMatches: (targetNodeId: SocketNodeId) => SocketPair[];

  findBestMatchesCached: (targetNodeId: SocketNodeId) => SocketPair[];

  removeSocketsForNode: (nodeId: string) => void;

  removeSocket: (socket: ConnectionSocket) => void;
}

export interface PipelineSockets {
  onNewComponentAdded: (node: PipelineComponent) => void;

  onNodeRemoved: (node: PipelineComponent) => void;

  onConnectionAdded: (node: PipelineConnection) => void;

  onConnectionRemoved: (node: PipelineConnection) => void;

  getMatchingSocketsForNode: (
    type: SocketType,
    nodeId: SocketNodeId,
  ) => MatchingSocketsView;

  createSocket: (
    type: SocketType,
    nodeId: SocketNodeId,
    name: string,
  ) => ConnectionSocket;

  getOrCreateSocket: (
    type: SocketType,
    nodeId: SocketNodeId,
    name: string,
  ) => ConnectionSocket;

  getSocketForNode: <T extends ConnectionSocket>(
    type: SocketType,
    nodeId: SocketNodeId,
    name: string,
  ) => T | undefined;

  getConnectedSockets: <
    T extends ConnectionSocket = ConnectionSocket,
  >() => Set<T>;

  sameSocket: (
    socket1?: ConnectionSocket | null,
    socket2?: ConnectionSocket | null,
  ) => boolean;
}
