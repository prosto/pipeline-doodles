import { isPrimitiveJsonSchema } from "@repo/json-schema";
import { mixinBase } from "@repo/shared/utils";

import { storeContext } from "../store-context";
import type { SchemaTreeItem, TreeItemDataPrimitive } from "../types";

import { treeItemDataCommon } from "./tree-item-common";
import type { TreeItemFactory } from "./types";

export function treeItemDataPrimitiveFactory(): TreeItemFactory<TreeItemDataPrimitive> {
  return storeContext.wrap({
    predicate({ schema }) {
      return isPrimitiveJsonSchema(schema);
    },

    async create(ctx) {
      const treeItemData = await treeItemDataCommon(ctx);

      const treeItem: SchemaTreeItem<TreeItemDataPrimitive> = {
        index: ctx.index,
        isFolder: false,
        children: [],

        data: mixinBase(treeItemData, {
          type: "schema-data-primitive",
        }),
      };

      return treeItem;
    },
  });
}
