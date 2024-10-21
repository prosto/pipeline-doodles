import { isDefined } from "@repo/shared/utils";

import { storeContext } from "../store-context";

import { treeItemDataCommon } from "./tree-item-common";
import { lookupMatchingVariant } from "./tree-item-variant-lookup";
import type { TreeItemFactory } from "./types";

export function treeItemDataUnionFactory(): TreeItemFactory {
  return storeContext.wrap({
    predicate({ schema, variantSchemaNode }) {
      return !isDefined(variantSchemaNode) && isDefined(schema.anyOf);
    },

    async create(context) {
      const { baseSchemaNode, treeItemFactory, newContext } = context;
      const schemaNode = baseSchemaNode;
      const { defaultVariant } = schemaNode;

      const { value } = await treeItemDataCommon(context);
      const matchingVariant = await lookupMatchingVariant({
        schemaNode,
        value,
      });

      return treeItemFactory(
        newContext({
          variantSchemaNode: matchingVariant ?? defaultVariant,
        }),
      );
    },
  });
}
