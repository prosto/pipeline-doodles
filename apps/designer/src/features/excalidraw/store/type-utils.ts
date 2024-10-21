import type { CustomExcalidrawElement } from "../../pipeline/store/canvas-elements/types";
import type { ExcalidrawElement, ExcalidrawArrowElement } from "../types";

export function isCustomExcalidrawElement(
  element: ExcalidrawElement,
): element is CustomExcalidrawElement {
  return (
    "customData" in element && typeof element.customData?.type !== "undefined"
  );
}

export function isArrowElement(
  element?: ExcalidrawElement | null,
): element is ExcalidrawArrowElement {
  return element?.type === "arrow";
}
