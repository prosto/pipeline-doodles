import { ensureIsDefined } from "@repo/shared/utils";
import isObject from "lodash-es/isObject";

import type { ObjectLoaderOptions } from "../types";

import type { ObjectLoaderContext } from "./types";

export function contextFactory(): (
  options: ObjectLoaderOptions,
) => ObjectLoaderContext {
  return (options) => {
    const {
      item: {
        data: { schemaNode, value, consumedProperties },
      },
    } = options;

    const schemaProperties = new Map(
      schemaNode.properties.map((prop) => [
        ensureIsDefined(prop.propertyName),
        prop,
      ]),
    );

    const valueProperties = new Map<string, unknown>();
    const valueAdditionalProperties = new Map<string, unknown>();
    for (const [propKey, propValue] of Object.entries(
      isObject(value) ? (value as Record<string, unknown>) : {},
    )) {
      if (schemaProperties.has(propKey)) {
        valueProperties.set(propKey, propValue);
      } else {
        valueAdditionalProperties.set(propKey, propValue);
      }
    }

    return {
      options,
      consumedProperties,
      schemaProperties,
      valueProperties,
      valueAdditionalProperties,
      treeItems: [],
    };
  };
}
