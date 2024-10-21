import type { SocketNodeId, SocketType } from "./types";

export function socketKey(
  type: SocketType,
  nodeId: SocketNodeId,
  name: string,
): string {
  return `${type}:::${nodeId}:::${name}`;
}
