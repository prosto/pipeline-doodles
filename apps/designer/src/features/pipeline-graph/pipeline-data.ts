import type { JsonWithMetadata } from "@repo/json-schema";
import { get, set, cloneDeep } from "lodash-es";
import { proxy, snapshot } from "valtio";

import { isValtioProxy } from "../store-utils";

import type { PipelineData } from "./types";

export function pipelineDataFactory(): PipelineData {
  const state: PipelineData["state"] = {
    components: {},
    documentStores: {},
    parameters: {
      max_loops_allowed: 100,
    },
  };

  function cloneValue<T extends object>(value: T): T {
    // @ts-expect-error -- Type (JsonWithMetadata) instantiation is excessively deep and possibly infinite
    return isValtioProxy(value) ? snapshot(value) : cloneDeep(value);
  }

  return {
    state,

    actions: {
      updateData({ pointer, newData, createCopy = true }): void {
        const { nodeType, nodeName, paramsType } = pointer;
        set(
          state,
          [nodeType, nodeName, paramsType],
          createCopy ? cloneValue(newData) : newData,
        );
      },

      getData({ pointer, createCopy = true }): JsonWithMetadata {
        const { nodeType, nodeName, paramsType } = pointer;
        const data = get(
          state,
          [nodeType, nodeName, paramsType],
          proxy({
            value: {},
            metadata: {},
          }),
        );

        return createCopy ? cloneValue(data) : data;
      },

      updateParameters(parameters: Record<string, unknown>) {
        set(state, ["parameters"], cloneValue(parameters));
      },
    },
  };
}
