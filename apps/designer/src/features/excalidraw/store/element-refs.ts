import isString from "lodash-es/isString";

import type { ExcalidrawElement } from "../types";

import type { ElementRef, ElementRefs } from "./types";

export function elementRefsFactory<
  T extends ExcalidrawElement = ExcalidrawElement,
>(refs: ElementRef<T>[]): ElementRefs<T> {
  const refsMap = new Map<string, ElementRef<T>>(
    refs.map((ref) => [ref.id, ref]),
  );

  return {
    refs,

    get elements() {
      return Array.from(refsMap.values()).map((ref) => ref.element);
    },

    get elementIds() {
      return Array.from(refsMap.keys());
    },

    hasRef(refOrId: ElementRef<T> | string) {
      const id = isString(refOrId) ? refOrId : refOrId.id;
      return refsMap.has(id);
    },

    removeRef(refOrId: ElementRef<T> | string) {
      const id = isString(refOrId) ? refOrId : refOrId.id;
      return refsMap.delete(id);
    },

    addRef(ref: ElementRef<T>) {
      refsMap.set(ref.id, ref);
    },

    refsCount() {
      return refsMap.size;
    },
  };
}
