import type { ElementRef } from "@/features/excalidraw/store/types";

import { canvasContext } from "../canvas-context";
import type {
  ComponentExcalidrawElement,
  ConnectionLinearElement,
  DocumentStoreExcalidrawElement,
} from "../types";

import { componentElementWrapper } from "./component-wrapper";
import { connectionElementWrapper } from "./connection-wrapper";
import { documentStoreElementWrapper } from "./document-store-wrapper";
import type { WrapperFactory } from "./types";

export function wrapperFactory(): WrapperFactory {
  return canvasContext.wrap({
    connection(elementRef: ElementRef<ConnectionLinearElement>) {
      return connectionElementWrapper(elementRef);
    },
    component(elementRef: ElementRef<ComponentExcalidrawElement>) {
      return componentElementWrapper(elementRef);
    },
    documentStore(elementRef: ElementRef<DocumentStoreExcalidrawElement>) {
      return documentStoreElementWrapper(elementRef);
    },
  });
}
