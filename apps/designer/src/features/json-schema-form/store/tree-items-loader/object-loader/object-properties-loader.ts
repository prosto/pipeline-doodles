import { isDefined, type ChainFnAsync } from "@repo/shared/utils";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import { storeContext } from "../../store-context";
import type { TreeItemFactoryOptions } from "../../tree-item-data-factory/types";

import type { ObjectLoaderContext } from "./types";

export function loadObjectProperties(): ChainFnAsync<ObjectLoaderContext> {
  const {
    treeItemFactory,
    settings: { objectLoaderOptions },
  } = storeContext.use();

  return async (
    { options, consumedProperties, schemaProperties, treeItems },
    nextFn,
  ) => {
    const {
      item: { index: parentIndex },
      hideOptional = objectLoaderOptions?.hideOptional,
      include = objectLoaderOptions?.include ?? [],
      hideDefaults = objectLoaderOptions?.hideDefaults,
    } = options;

    function shouldAddPropertyAsTreeItem({
      propertyName,
      isOptional,
      defaultValue,
    }: SchemaNodeDescriptor): boolean {
      if (!propertyName || consumedProperties.includes(propertyName)) {
        return false;
      }

      // Always show properties which are configured to be shown
      if (include.includes(propertyName)) {
        return true;
      }

      if (hideOptional && isOptional) {
        return false;
      }

      if (hideDefaults && isDefined(defaultValue)) {
        return false;
      }

      return true;
    }

    const propertiesToLoad: TreeItemFactoryOptions[] = [];

    for (const [
      propertyName,
      propertySchemaNode,
    ] of schemaProperties.entries()) {
      if (shouldAddPropertyAsTreeItem(propertySchemaNode))
        propertiesToLoad.push({
          baseSchemaNode: propertySchemaNode,
          parentIndex,
          key: propertyName,
        });
    }

    const newTreeItems = await Promise.all(
      propertiesToLoad.map((treeItemOptions) =>
        treeItemFactory.createTreeItem(treeItemOptions),
      ),
    );
    treeItems.push(...newTreeItems);

    return nextFn();
  };
}
