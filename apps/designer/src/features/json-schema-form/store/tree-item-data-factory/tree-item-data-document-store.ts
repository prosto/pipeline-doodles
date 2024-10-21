import type { SchemaNodeDocumentStore } from "@/features/json-schema-reflection";
import { SchemaNodeTypes } from "@/features/json-schema-reflection";

import { storeContext } from "../store-context";

import type { TreeItemFactory } from "./types";

export function treeItemDataDocumentStoreFactory(): TreeItemFactory {
  return storeContext.wrap({
    predicate({ schemaNode: { nodeType } }) {
      return nodeType === SchemaNodeTypes.SchemaNodeDocumentStore;
    },

    async create(context) {
      const { schemaNode, isVariant, treeItemFactory, newContext } = context;
      const { init: initParameters } = schemaNode as SchemaNodeDocumentStore;

      const schemaContext = isVariant
        ? {
            variantSchemaNode: initParameters,
          }
        : {
            baseSchemaNode: initParameters,
          };

      return treeItemFactory(newContext(schemaContext));
    },
  });
}
