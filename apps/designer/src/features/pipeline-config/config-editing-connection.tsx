import type { HTMLAttributes } from "react";
import React from "react";
import { useSnapshot } from "valtio";

import { useCanvasEditingConnection } from "@/features/pipeline/hooks/use-canvas";
import type { EditingConnection } from "@/features/pipeline/store/editing-connection";
import type { ConnectionSocket } from "@/features/pipeline-graph/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

type ConfigEditingConnectionProps = HTMLAttributes<HTMLDivElement>;

export function ConfigEditingConnection({
  className,
}: ConfigEditingConnectionProps): JSX.Element {
  const editingConnection = useCanvasEditingConnection();
  const { isConnecting } = useSnapshot(editingConnection.state);

  return (
    <div className={cn("tw-flex tw-flex-col", className)}>
      {isConnecting ? (
        <p>Connecting</p>
      ) : (
        // <MatchingSocketsTable editingConnection={editingConnection.state} />
        <p>No active connections</p>
      )}
    </div>
  );
}

interface MatchingSocketsTableProps {
  editingConnection: EditingConnection["state"];
}

export function MatchingSocketsTable({
  editingConnection,
}: MatchingSocketsTableProps): JSX.Element | null {
  const { matchingSockets, sourceSocket, targetSocket } = editingConnection;
  const { isBinding } = useSnapshot(editingConnection);

  if (!matchingSockets) return null;

  const socketPairs: [ConnectionSocket, ConnectionSocket, boolean][] = [];

  for (const [source, targetsPerNode] of matchingSockets.getSockets()) {
    for (const [_nodeId, targetSockets] of targetsPerNode.normEntries()) {
      targetSockets.forEach((target) =>
        socketPairs.push([
          source,
          target,
          isBinding &&
            source.key === sourceSocket?.key &&
            target.key === targetSocket?.key,
        ]),
      );
    }
  }

  const [[firstSource, _target]] = socketPairs;
  const [sourceType, targetType] =
    firstSource.type === "output" ? ["Output", "Input"] : ["Input", "Output"];

  return (
    <Table>
      <TableCaption>A list of connecting nodes and sockets.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>{sourceType}</TableHead>
          <TableHead>{targetType}</TableHead>
          <TableHead>Target</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {socketPairs.map(([source, target, socketsAreBinding]) => (
          <TableRow
            className={cn(socketsAreBinding && "tw-bg-ring/20")}
            key={source.key + target.key}
          >
            <TableCell>{source.nodeName}</TableCell>
            <TableCell>{source.name}</TableCell>
            <TableCell>{target.name}</TableCell>
            <TableCell>{target.nodeName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
