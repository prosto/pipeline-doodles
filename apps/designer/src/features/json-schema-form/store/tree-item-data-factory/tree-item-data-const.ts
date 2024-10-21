import { isDefined, mixinBase } from "@repo/shared/utils";

import { storeContext } from "../store-context";
import type { SchemaTreeItem, TreeItemDataConst } from "../types";

import { treeItemDataCommon } from "./tree-item-common";
import type { TreeItemFactory } from "./types";

export function treeItemDataConstFactory(): TreeItemFactory<TreeItemDataConst> {
  return storeContext.wrap({
    predicate({ schema }) {
      return isDefined(schema.const);
    },

    async create(ctx) {
      const { index, schema } = ctx;

      const treeItemData = await treeItemDataCommon({
        ...ctx,
        value: schema.const,
      });

      const treeItem: SchemaTreeItem<TreeItemDataConst> = {
        index,
        isFolder: false,
        children: [],

        data: mixinBase(treeItemData, {
          type: "schema-data-const",
          isHidden: true, // By default we hide "const" tree items in a tree
        }),
      };

      return treeItem;
    },
  });
}
