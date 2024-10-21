import { subscribe } from "valtio";

import { elementRefsFactory } from "@/features/excalidraw";
import type { ElementRef } from "@/features/excalidraw/store/types";
import type { PipelineComponent } from "@/features/pipeline-graph/types";

import { canvasContext } from "../canvas-context";
import { bindDataToElements } from "../data-binding";
import type {
  ComponentExcalidrawElement,
  PipelineComponentElement,
} from "../types";

interface ComponentElementProps {
  elementRefs: ElementRef<ComponentExcalidrawElement>[];
  component: PipelineComponent;
  isStaged?: boolean;
}

export function componentElement({
  component,
  elementRefs,
  isStaged,
}: ComponentElementProps): PipelineComponentElement {
  const {
    excalidraw: {
      actions: { updateElementsInPlace },
    },
    excalidrawActions: { runAction },
  } = canvasContext.useX();

  const { id: componentId } = component.state;

  const state: PipelineComponentElement["state"] = {
    id: componentId,
    nodeId: componentId,
    elementRefs: elementRefsFactory(elementRefs),
    node: component,
    isStaged,
  };

  function updateElementsData(): void {
    const nodeState = state.node.state;
    const elements = state.elementRefs.elements;
    const { name } = nodeState;

    bindDataToElements(elements, {
      state: nodeState,
    });

    if (!isStaged) {
      updateElementsInPlace({
        elementsOrIds: elements,
        updateData: {
          customData: {
            id: componentId,
            name,
          },
        },
      });
    }
  }

  subscribe(state.node.state, updateElementsData);

  updateElementsData();

  return {
    state,
    actions: {
      detachElement(ref: ElementRef<ComponentExcalidrawElement>) {
        state.elementRefs.removeRef(ref);
        return state.elementRefs.refsCount();
      },

      attachElement(ref: ElementRef<ComponentExcalidrawElement>) {
        ref.element.customData.status = "ready";
        state.elementRefs.addRef(ref);
      },

      selectElements() {
        runAction("selectElements", state.elementRefs.elements);
      },
    },
  };
}
