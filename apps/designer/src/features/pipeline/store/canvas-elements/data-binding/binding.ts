import set from "lodash-es/set";

import type { CustomExcalidrawElement } from "../types";

import { template } from "./templates";

export function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x;
}

function bindDataToElement(
  element: CustomExcalidrawElement,
  data?: Record<string, unknown>,
): void {
  const binding = element.customData.binding;

  if (binding) {
    Object.keys(binding).forEach((propertyName) => {
      if (isKey(binding, propertyName)) {
        const templateStr = binding[propertyName];
        if (templateStr) {
          // const existingValue = get(element, propertyName);
          const bindingValue = template(templateStr, data);
          set(element, propertyName, bindingValue);
        }
      }
    });
  }
}

export function bindDataToElements(
  elements: CustomExcalidrawElement[],
  data?: Record<string, unknown>,
): void {
  for (const element of elements) {
    bindDataToElement(element, data);
  }
}
