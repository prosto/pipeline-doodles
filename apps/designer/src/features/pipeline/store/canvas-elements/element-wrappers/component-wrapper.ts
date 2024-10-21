import type { ElementRef } from "@/features/excalidraw/store/types";

import { canvasContext } from "../canvas-context";
import type { ComponentExcalidrawElement } from "../types";

import type { ComponentElementWrapper } from "./types";

export function componentElementWrapper(
  elementRef: ElementRef<ComponentExcalidrawElement>,
): ComponentElementWrapper {
  const {
    components: {
      actions: { getComponentByElementId },
    },
  } = canvasContext.useX();

  const wrapper = {
    elementRef,

    elementId: elementRef.id,

    get schemaId() {
      return elementRef.element.customData.schemaId;
    },

    get customId() {
      return elementRef.element.customData.id;
    },

    get status() {
      return elementRef.element.customData.status;
    },

    get componentId() {
      return wrapper.component?.state.id;
    },

    get component() {
      return getComponentByElementId(elementRef.id);
    },

    get node() {
      return wrapper.component?.state.node;
    },
  };

  return wrapper;
}
