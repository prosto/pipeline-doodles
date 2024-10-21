import type { ElementRef } from "@/features/excalidraw/store/types";

import type { DocumentStoreExcalidrawElement } from "../types";

import type { DocumentStoreElementWrapper } from "./types";

export function documentStoreElementWrapper(
  elementRef: ElementRef<DocumentStoreExcalidrawElement>,
): DocumentStoreElementWrapper {
  const wrapper: DocumentStoreElementWrapper = {
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
  };

  return wrapper;
}
