import type { ChainFnAsync } from "@repo/shared/utils";
import { ensureIsDefined } from "@repo/shared/utils";

import { jsonTypeToDescriptor } from "@/features/json-schema-reflection";

import { storeContext } from "../../store-context";
import type { SchemaTreeItem } from "../../types";

import type { ObjectLoaderContext } from "./types";

export function loadDynamicProperties(): ChainFnAsync<ObjectLoaderContext> {
  const { treeItemFactory } = storeContext.use();

  return async (ctx, nextFn) => {
    const {
      valueAdditionalProperties,
      options: {
        item: {
          index: parentIndex,
          data: {
            schemaNode: { dynamicProperties, findDynamicProperty },
          },
        },
      },
      treeItems,
    } = ctx;

    if (dynamicProperties.length === 0) {
      return nextFn();
    }

    const propertiesToLoad: Promise<SchemaTreeItem>[] = [];

    for (const [
      propertyKey,
      propertyValue,
    ] of valueAdditionalProperties.entries()) {
      const valueDescriptor = jsonTypeToDescriptor(propertyValue);
      const additionalSchemaNode = ensureIsDefined(
        findDynamicProperty(valueDescriptor),
      );

      propertiesToLoad.push(
        treeItemFactory.createTreeItem({
          baseSchemaNode: additionalSchemaNode,
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
