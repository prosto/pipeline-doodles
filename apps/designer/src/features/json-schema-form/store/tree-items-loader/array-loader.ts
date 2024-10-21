import { ensureIsDefined } from "@repo/shared/utils";

import type {
  SchemaNodeArray,
  SchemaNodeDescriptor,
} from "@/features/json-schema-reflection";
import { jsonTypeToDescriptor } from "@/features/json-schema-reflection";

import { storeContext } from "../store-context";

import type { TreeItemsArrayLoader } from "./types";

export function treeItemsArrayLoader(): TreeItemsArrayLoader {
  const { treeItemFactory } = storeContext.useX();

  function resolveSchemaItemNode(
    schemaNode: SchemaNodeArray,
    arrValue: unknown,
    arrIndex: number,
  ): SchemaNodeDescriptor {
    const { prefixItems, items } = schemaNode;

    if (arrIndex < prefixItems.length) {
      return prefixItems[arrIndex];
    } else if (items.length === 1) {
      return items[0];
    }

    const dynamicSchemaNode = schemaNode.findMatchingItem(
      jsonTypeToDescriptor(arrValue),
    );

    return ensureIsDefined(dynamicSchemaNode);
  }

  return {
    async loadArrayTreeItems(options) {
      const {
        item: {
          index: parentIndex,
          data: { value: arrayValue, schemaNode },
        },
      } = options;

      if (Array.isArray(arrayValue)) {
        return Promise.all(
          arrayValue.map((value, arrIndex) => {
            const itemSchemaNode = resolveSchemaItemNode(
              schemaNode,
              value,
              arrIndex,
            );

            return treeItemFactory.createTreeItem({
              baseSchemaNode: itemSchemaNode,
              parentIndex,
              key: String(arrIndex),
            });
          }),
        );
      }

      return [];
    },
  };
}
