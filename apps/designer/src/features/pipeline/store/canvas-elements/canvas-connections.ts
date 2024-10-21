import { ensureIsDefined } from "@repo/shared/utils";
import { _ } from "node_modules/ts-pattern/dist/patterns";
import { proxyMap } from "valtio/utils";

import type {
  ExcalidrawArrowElement,
  ExcalidrawElement,
} from "@/features/excalidraw/types";
import type {
  ConnectionSocket,
  PipelineConnection,
} from "@/features/pipeline-graph/types";

import { canvasContext } from "./canvas-context";
import type { ConnectionElementWrapper } from "./element-wrappers/types";
import { connectionElement } from "./elements/connection-element";
import type { CanvasConnections, PipelineConnectionElement } from "./types";

interface ConnectionElementProps {
  sourceSocket: ConnectionSocket;
  targetSocket: ConnectionSocket;
  arrowWrapper: ConnectionElementWrapper;
}

export function canvasConnectionsFactory(): CanvasConnections {
  const { excalidraw, pipelineGraph } = canvasContext.useX();
  const connectionElementFactory = canvasContext.wrapFn(connectionElement);

  const connections = proxyMap<
    PipelineConnectionElement["state"]["id"],
    PipelineConnectionElement
  >();

  const connectionToElement = new Map<
    PipelineConnection["state"]["id"],
    PipelineConnectionElement["state"]["id"]
  >();

  const elementToConnection = new Map<
    ExcalidrawElement["id"],
    PipelineConnectionElement["state"]["id"]
  >();

  const {
    actions: { updateElements, setToast },
  } = excalidraw;

  const { getOrCreateSocket } = pipelineGraph.state.sockets;

  const state: CanvasConnections["state"] = {
    connections,
  };

  function getConnectionByElementId(
    elementId: ExcalidrawElement["id"],
  ): PipelineConnectionElement | undefined {
    const connectionId = elementToConnection.get(elementId);
    return connectionId ? actions.getConnectionById(connectionId) : undefined;
  }

  function handleComponentConnections(
    elementWrappers: ConnectionElementWrapper[],
  ): void {
    for (const wrapper of elementWrappers) {
      if (
        wrapper.hasData &&
        wrapper.sourceNode &&
        wrapper.targetNode &&
        wrapper.sourceProperty &&
        wrapper.targetProperty
      ) {
        const sourceSocket = getOrCreateSocket(
          "output",
          wrapper.sourceNode.state.id,
          wrapper.sourceProperty,
        );
        const targetSocket = getOrCreateSocket(
          "input",
          wrapper.targetNode.state.id,
          wrapper.targetProperty,
        );

        const existingConnection = getConnectionByElementId(wrapper.elementId);

        if (existingConnection) {
          const {
            sourceSocket: existingSourceSocket,
            targetSocket: existingTargetSocket,
          } = existingConnection.state;
          if (
            sourceSocket !== existingSourceSocket ||
            targetSocket !== existingTargetSocket
          ) {
            removeConnection(wrapper.elementId);

            createConnectionElement({
              sourceSocket,
              targetSocket,
              arrowWrapper: wrapper,
            });
          }
        } else {
          createConnectionElement({
            sourceSocket,
            targetSocket,
            arrowWrapper: wrapper,
          });
        }
      } else if (elementToConnection.has(wrapper.elementId)) {
        removeConnection(wrapper.elementId);
      }
    }
  }

  function createConnectionElement({
    sourceSocket,
    targetSocket,
    arrowWrapper,
  }: ConnectionElementProps): PipelineConnectionElement {
    const connection = pipelineGraph.actions.addConnection(
      sourceSocket,
      targetSocket,
    );

    const newConnection = connectionElementFactory({
      connectionId: connection.state.id,
      arrowWrapper,
    });
    const connectionElementId = newConnection.state.id;

    connections.set(newConnection.state.id, newConnection);
    connectionToElement.set(connection.state.id, connectionElementId);
    elementToConnection.set(arrowWrapper.elementId, connectionElementId);

    // setToast({
    //   message: `Connected: ${sourceSocket.name} -> ${targetSocket.name}`,
    //   closable: true,
    //   duration: 10000,
    // });

    return newConnection;
  }

  function removeConnection(elementId: string): void {
    const connectionId = elementToConnection.get(elementId);

    if (connectionId) {
      const connection = ensureIsDefined(connections.get(connectionId));
      const { sourceSocket, targetSocket } = connection.state;

      connections.delete(connectionId);
      connectionToElement.delete(connectionId);
      pipelineGraph.actions.removeConnection(connectionId);

      setToast({
        message: `Removed: ${sourceSocket.name} -> ${targetSocket.name}`,
        closable: true,
        duration: 10000,
      });
    }

    elementToConnection.delete(elementId);
  }

  const actions: CanvasConnections["actions"] = {
    handleAdded(elementWrappers: ConnectionElementWrapper[]): void {
      handleComponentConnections(elementWrappers);
    },

    handleUpdated(elementWrappers: ConnectionElementWrapper[]): void {
      handleComponentConnections(elementWrappers);
    },

    handleDeleted(_elementWrappers: ConnectionElementWrapper[]) {
      // TODO
    },

    handleRemoved(_elementWrappers: ConnectionElementWrapper[]) {
      // TODO
    },

    attachConnectionDataToArrow({
      arrowElement,
      sourceProperty,
      targetProperty,
    }): void {
      setTimeout(() => {
        updateElements({
          elementIds: [arrowElement.id],
          updateData: {
            customData: {
              ...arrowElement.customData,
              type: "connection",
              sourceProperty,
              targetProperty,
            },
          },
        });
      }, 0);
    },

    removeConnectionData(arrowElement: ExcalidrawArrowElement) {
      updateElements({
        elementIds: [arrowElement.id],
        updateData: {
          customData: {},
        },
      });
    },

    getConnectionById(id: PipelineConnectionElement["state"]["id"]) {
      return connections.get(id);
    },

    hasConnectionWithElementId(elementId: ExcalidrawElement["id"]) {
      return elementToConnection.has(elementId);
    },

    getConnectionByElementId,
  };

  return {
    state,
    actions,
  };
}
