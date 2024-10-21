import { mapOfSets } from "@repo/shared/utils";
import { defaultTo, memoize, uniq } from "lodash-es";

import type {
  ConnectionSocket,
  MatchingSockets,
  MatchingSocketsPerNode,
  MatchingSocketsView,
  SocketNodeId,
  SocketPair,
} from "./types";

export function matchingSocketsView(
  matchingSockets: MatchingSockets = new Map(),
): MatchingSocketsView {
  const toWeight = (socket: ConnectionSocket): number =>
    socket.schemaNode.isOptional ? 0 : 1;

  function getMatchingNodes(): SocketNodeId[] {
    return uniq(
      Array.from(matchingSockets.values()).flatMap((socketsPerNode) =>
        socketsPerNode.keysArray(),
      ),
    );
  }

  function findBestMatches(targetNodeId: SocketNodeId): SocketPair[] {
    const result: [ConnectionSocket, ConnectionSocket][] = [];
    for (const [sourceSocket, socketsPerNode] of matchingSockets) {
      const targetSockets = socketsPerNode.getValueOrDefault(targetNodeId);
      targetSockets.forEach((targetSocket) =>
        result.push([sourceSocket, targetSocket]),
      );
    }

    return result.sort((match1, match2) => {
      const weight1 = toWeight(match1[0]) * 2 + toWeight(match1[1]);
      const weight2 = toWeight(match2[0]) * 2 + toWeight(match2[1]);

      return weight1 - weight2;
    });
  }

  function addMatching(
    sourceSocket: ConnectionSocket,
    connectingNodeId: SocketNodeId,
    targetSockets: ConnectionSocket[],
  ): void {
    const nodeToSockets = defaultTo<MatchingSocketsPerNode>(
      matchingSockets.get(sourceSocket),
      mapOfSets(),
    );

    nodeToSockets.addValues(connectingNodeId, targetSockets);
    matchingSockets.set(sourceSocket, nodeToSockets);
  }

  function removeSocketsForNode(nodeId: string): void {
    for (const socketsPerNode of matchingSockets.values()) {
      socketsPerNode.delete(nodeId);
    }
  }

  function removeSocket(socket: ConnectionSocket): void {
    matchingSockets.delete(socket);
  }

  function filterOutConnected(
    socketsPerNode: MatchingSocketsPerNode,
  ): MatchingSocketsPerNode {
    const results: [SocketNodeId, Set<ConnectionSocket>][] = [];
    for (const [nodeId, sockets] of socketsPerNode.entries()) {
      const freeSockets = [...sockets].filter((socket) => socket.canConnect);
      if (freeSockets.length > 0) {
        results.push([nodeId, new Set(freeSockets)]);
      }
    }
    return mapOfSets(new Map(results));
  }

  function getMatchingSockets(
    ...sourceSockets: ConnectionSocket[]
  ): MatchingSocketsView {
    const resultEntries: [ConnectionSocket, MatchingSocketsPerNode][] = [];
    for (const socket of sourceSockets) {
      if (socket.canConnect) {
        const matched = matchingSockets.get(socket);
        if (matched && matched.size > 0) {
          resultEntries.push([socket, filterOutConnected(matched)]);
        }
      }
    }

    return matchingSocketsView(new Map(resultEntries));
  }

  function getSockets(): MatchingSockets {
    return matchingSockets;
  }

  return {
    getSockets,
    addMatching,
    getMatchingNodes,
    getMatchingSockets,
    getMatchingNodesCached: memoize(getMatchingNodes),
    findBestMatches,
    findBestMatchesCached: memoize(findBestMatches),
    removeSocketsForNode,
    removeSocket,
  };
}
