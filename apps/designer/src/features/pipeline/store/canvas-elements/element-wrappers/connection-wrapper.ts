import has from "lodash-es/has";

import type { ElementRef } from "@/features/excalidraw/store/types";
import type { ExcalidrawTextElement } from "@/features/excalidraw/types";
import type { ConnectionSocket } from "@/features/pipeline-graph/types";

import { canvasContext } from "../canvas-context";
import type {
  ConnectionLinearElement,
  PipelineComponentElement,
} from "../types";

import type { ConnectionElementWrapper } from "./types";

export function connectionElementWrapper(
  elementRef: ElementRef<ConnectionLinearElement>,
): ConnectionElementWrapper {
  const {
    components: {
      actions: { getComponentByElementId },
    },
    connections,
    pipelineGraph: {
      state: { sockets },
    },
    excalidraw: {
      actions: { getElement },
    },
  } = canvasContext.useX();

  const element = elementRef.element;
  const { startBinding, endBinding } = element;

  const wrapper: ConnectionElementWrapper = {
    elementRef,
    elementId: element.id,
    element,
    hasData: has(element, "customData.type"),

    get connectionId() {
      return wrapper.connection?.state.id;
    },

    get connection() {
      return connections.actions.getConnectionByElementId(element.id);
    },

    get sourceSocket(): ConnectionSocket | undefined {
      const nodeId = wrapper.sourceNode?.state.id;
      const socketName = wrapper.sourceProperty;

      if (nodeId && socketName) {
        return sockets.getSocketForNode("output", nodeId, socketName);
      }

      return undefined;
    },

    get targetSocket(): ConnectionSocket | undefined {
      const nodeId = wrapper.targetNode?.state.id;
      const socketName = wrapper.targetProperty;

      if (nodeId && socketName) {
        return sockets.getSocketForNode("input", nodeId, socketName);
      }

      return undefined;
    },

    get sourceElementId(): string | undefined {
      return startBinding?.elementId;
    },

    get sourceComponent(): PipelineComponentElement | undefined {
      if (startBinding?.elementId) {
        return getComponentByElementId(startBinding.elementId);
      }
      return undefined;
    },

    get sourceNode() {
      return wrapper.sourceComponent?.state.node;
    },

    get sourceProperty() {
      return element.customData.sourceProperty;
    },

    get targetElementId(): string | undefined {
      return endBinding?.elementId;
    },

    get targetComponent(): PipelineComponentElement | undefined {
      if (endBinding?.elementId) {
        return getComponentByElementId(endBinding.elementId);
      }
      return undefined;
    },

    get targetNode() {
      return wrapper.targetComponent?.state.node;
    },

    get targetProperty() {
      return element.customData.targetProperty;
    },

    get hasBoundText() {
      return Boolean(element.boundElements?.find((el) => el.type === "text"));
    },

    get labelElement() {
      const boundTextElement = element.boundElements?.find(
        (el) => el.type === "text",
      );

      if (boundTextElement) {
        return getElement<ExcalidrawTextElement>(boundTextElement.id);
      }

      return undefined;
    },
  };

  return wrapper;
}
