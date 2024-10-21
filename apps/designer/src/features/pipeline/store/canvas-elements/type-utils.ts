import type { ElementRef } from "@/features/excalidraw";
import type { ExcalidrawElement } from "@/features/excalidraw/types";

import type {
  ComponentExcalidrawElement,
  ConnectionExcalidrawElement,
  ConnectionLinearElement,
  CustomExcalidrawElement,
  DocumentStoreExcalidrawElement,
} from "./types";

export function isCustomExcalidrawElement(
  element: ExcalidrawElement,
): element is CustomExcalidrawElement {
  return (
    "customData" in element && typeof element.customData?.type !== "undefined"
  );
}

export function isCustomExcalidrawElementRef(
  ref: ElementRef,
): ref is ElementRef<CustomExcalidrawElement> {
  return isCustomExcalidrawElement(ref.element);
}

export function isComponentElement(
  element: ExcalidrawElement,
): element is ComponentExcalidrawElement {
  return (
    isCustomExcalidrawElement(element) &&
    element.customData.type === "component" &&
    Boolean(element.customData.schemaId)
  );
}

export function isComponentElementRef(
  ref: ElementRef,
): ref is ElementRef<ComponentExcalidrawElement> {
  return isComponentElement(ref.element);
}

export function isConnectionElement(
  element: ExcalidrawElement,
): element is ConnectionExcalidrawElement {
  return (
    isCustomExcalidrawElement(element) &&
    element.customData.type === "connection"
  );
}

export function isConnectionElementRef(
  ref: ElementRef,
): ref is ElementRef<ConnectionExcalidrawElement> {
  return isConnectionElement(ref.element);
}

export function isConnectionLinearElementRef(
  ref: ElementRef,
): ref is ElementRef<ConnectionLinearElement> {
  return isConnectionLinearElement(ref.element);
}

export function isConnectionLinearElement(
  element: ExcalidrawElement,
): element is ConnectionLinearElement {
  return (
    isCustomExcalidrawElement(element) &&
    element.customData.type === "connection" &&
    element.type === "arrow"
  );
}

export function isDocumentStoreElement(
  element: ExcalidrawElement,
): element is DocumentStoreExcalidrawElement {
  return (
    isCustomExcalidrawElement(element) &&
    element.customData.type === "document-store" &&
    Boolean(element.customData.schemaId)
  );
}
