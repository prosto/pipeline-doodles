import { ensureIsDefined } from "@repo/shared/utils";
import { subscribe } from "valtio";

import type { PipelineConnection } from "@/features/pipeline-graph/types";

import { canvasContext } from "../canvas-context";
import { bindDataToElements } from "../data-binding";
import type { ConnectionElementWrapper } from "../element-wrappers/types";
import type { PipelineConnectionElement } from "../types";

interface ConnectionElementProps {
  connectionId: PipelineConnection["state"]["id"];
  arrowWrapper: ConnectionElementWrapper;
}

export function connectionElement({
  connectionId,
  arrowWrapper,
}: ConnectionElementProps): PipelineConnectionElement {
  const {
    excalidrawActions: { runAction },
    excalidraw: {
      actions: { convert, insertElement },
    },
    pipelineGraph,
  } = canvasContext.useX();

  const { element: arrowElement, labelElement } = arrowWrapper;

  const state: PipelineConnectionElement["state"] = {
    id: connectionId,
    connectionId,
    arrowElement,

    get connection() {
      return ensureIsDefined(pipelineGraph.actions.getConnection(connectionId));
    },

    get sourceSocket() {
      return this.connection.state.source;
    },

    get targetSocket() {
      return this.connection.state.target;
    },
  };

  function getConnectionLabel(): string {
    const { name: sourceSocketName } = state.sourceSocket;
    const { name: targetSocketName } = state.targetSocket;

    if (sourceSocketName !== targetSocketName) {
      return `:${sourceSocketName}\n->\n:${targetSocketName}`;
    }

    return `:${sourceSocketName}`;
  }

  function createLabelIfAbsent(): void {
    if (!labelElement) {
      const [boundArrow, boundText] = convert([
        {
          ...arrowElement,
          label: {
            text: getConnectionLabel(),
            fontSize: 16,
            fontFamily: 3,
            strokeColor: "#1971c2",
          },
        },
      ]);

      Object.assign(arrowElement, { boundElements: boundArrow.boundElements });
      Object.assign(boundText, { containerId: arrowElement.id });
      insertElement(boundText);
    }
  }

  subscribe(state.connection, () => {
    bindDataToElements([arrowElement], {
      state: state.connection.state,
    });
  });

  createLabelIfAbsent();

  return {
    state,

    actions: {
      selectElements() {
        runAction("selectElements", [state.arrowElement]);
      },
    },
  };
}
