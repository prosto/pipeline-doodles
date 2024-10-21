import { mixinBase } from "@repo/shared/utils";

import { SchemaNodeTypes } from "@/features/json-schema-reflection";

import { storeContext } from "../store-context";
import type { SchemaTreeItem, TreeItemDataArray } from "../types";

import { treeItemDataCommon } from "./tree-item-common";
import type { TreeItemFactory } from "./types";

export function treeItemDataArrayFactory(): TreeItemFactory<TreeItemDataArray> {
  return storeContext.wrap({
    predicate({ schemaNode }) {
      return schemaNode.nodeType === SchemaNodeTypes.SchemaNodeArray;
    },

    async create(ctx) {
      const treeItemData = await treeItemDataCommon(ctx);

      const treeItem: SchemaTreeItem<TreeItemDataArray> = {
        index: ctx.index,
        isFolder: true,
        children: [],

        data: mixinBase(treeItemData, {
          type: "schema-data-array",

          loadingState: {
            isLoaded: false,
            isLoading: false,
          },
        }),
      };

      return treeItem;
    },
  });
}
