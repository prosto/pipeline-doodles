import { isDefined, mixinBase } from "@repo/shared/utils";

import {
  SchemaNodeTypes,
  type SchemaNodeObject,
} from "@/features/json-schema-reflection";

import { storeContext } from "../store-context";
import type { SchemaTreeItem, TreeItemDataObject } from "../types";

import { treeItemDataCommon } from "./tree-item-common";
import type { TreeItemFactory } from "./types";

export function treeItemDataObjectFactory(): TreeItemFactory<TreeItemDataObject> {
  const {
    treeItems: {
      actions: { getChildren },
    },
  } = storeContext.useX();

  return storeContext.wrap({
    predicate({ schemaNode }) {
      return schemaNode.nodeType === SchemaNodeTypes.SchemaNodeObject;
    },

    async create(ctx) {
      const treeItemData = await treeItemDataCommon(ctx);
      const { schemaNode } = treeItemData;
      const schemaNodeObject = schemaNode as SchemaNodeObject;

      const treeItem: SchemaTreeItem<TreeItemDataObject> = {
        index: ctx.index,
        isFolder: true,
        children: [],

        data: mixinBase(treeItemData, {
          type: "schema-data-object",

          loadingState: {
            isLoaded: false,
            isLoading: false,
          },

          get consumedProperties() {
            return getChildren(ctx.index)
              .map(({ data }) => data.propertyName)
              .filter(isDefined);
          },

          get nonConsumedProperties() {
            const consumed: string[] = this.consumedProperties;
            return schemaNodeObject.properties.filter(
              ({ propertyName }) => !consumed.includes(propertyName),
            );
          },

          get freeOptionalProperties() {
            return schemaNodeObject.properties.filter(
              ({ isOptional, propertyName }) =>
                isOptional && !this.consumedProperties.includes(propertyName),
            );
          },

          get isHidden() {
            // if (!this.loadingState.isLoaded) {
            //   return true;
            // }

            // return getChildren(ctx.index).every((child) => child.data.isHidden);

            return false;
          },
        }),
      };

      return treeItem;
    },
  });
}
