import type { ChainFnAsync } from "@repo/shared/utils";

import { storeContext } from "../../store-context";
import type { SchemaTreeItem } from "../../types";

import type { ObjectLoaderContext } from "./types";

export function loadAdditionalProperties(): ChainFnAsync<ObjectLoaderContext> {
  const { treeItemFactory } = storeContext.use();

  return async (ctx, nextFn) => {
    const {
      valueAdditionalProperties,
      options: {
        item: {
          index: parentIndex,
          data: {
            schemaNode: { additionalProperties },
          },
        },
      },
      treeItems,
    } = ctx;

    if (additionalProperties.length === 0) {
      return nextFn();
    }

    const [propertySchemaNode] = additionalProperties;
    const propertiesToLoad: Promise<SchemaTreeItem>[] = [];

    for (const [
      propertyKey,
      propertyValue,
    ] of valueAdditionalProperties.entries()) {
      propertiesToLoad.push(
        treeItemFactory.createTreeItem({
          baseSchemaNode: propertySchemaNode,
          parentIndex,
          key: propertyKey,
          value: propertyValue,
        }),
      );

      valueAdditionalProperties.delete(propertyKey);
    }

    const newTreeItems = await Promise.all(propertiesToLoad);
    treeItems.push(...newTreeItems);

    return nextFn();
  };
}
