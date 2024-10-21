import type { JSONObject, JsonWithMetadata } from "@repo/json-schema";
import { getId } from "@repo/shared/utils";
import type { TreeItemIndex } from "react-complex-tree";

import { isSchemaNodeParams } from "@/features/json-schema-reflection";

import { storeContext } from "./store-context";
import { isSchemaNodeDescriptor, isTreeItemDataArray } from "./type-utils";
import type { RootTreeItem, SchemaTree, SchemaTreeItem } from "./types";

const rootIndex = "root";

export function schemaTreeFactory(): SchemaTree {
  const {
    treeItems: {
      state: { treeItems },
      actions: {
        getTreeItem,
        getParentTreeItem,
        getPosition,
        addTreeItem,
        addTreeItems,
        removeTreeItem,
        getChildren,
      },
    },
    treeValues,
    treeItemFactory,
    objectLoader,
    arrayLoader,
    schemaTypeReflection,
  } = storeContext.useX();

  // Using assign to avoid type checks as "root" item is the only special tree item
  Object.assign(treeItems, {
    [rootIndex]: {
      index: rootIndex,
      isFolder: true,
      children: [],
      canMove: false,
      canRename: false,
      data: {
        type: "root",

        // root data storage for child items
        value: treeValues.getValue(),
      },
    } as RootTreeItem,
  });

  function showTreeItemValues(index: TreeItemIndex, offset = 0): void {
    const item = treeItems[index];

    item.children?.forEach((child) => {
      showTreeItemValues(child, offset + 10);
    });
  }

  const actions: SchemaTree["actions"] = {
    async addTopLevelItem(topLevelSchema): Promise<SchemaTreeItem> {
      const { schema, refPath, initialValue, name } = topLevelSchema;

      const baseSchemaNode = isSchemaNodeDescriptor(schema)
        ? schema
        : await schemaTypeReflection.buildReflectionTree(schema, refPath);

      const newTreeItem = await treeItemFactory.createTreeItem({
        baseSchemaNode,
        initialValue,
        index: name,
        parentIndex: rootIndex,
      });

      addTreeItem(newTreeItem, rootIndex);

      showTreeItemValues(rootIndex);

      return newTreeItem;
    },

    async addTreeItemForNode({ schemaNode, parentIndex }) {
      const treeItem = await treeItemFactory.createTreeItem({
        index: getId(),
        baseSchemaNode: schemaNode,
        parentIndex,
      });

      addTreeItem(treeItem, parentIndex);

      showTreeItemValues(rootIndex);
    },

    async loadObjectTreeItems(options) {
      const { index: parentIndex } = options.item;

      const newTreeItems = await objectLoader.loadObjectTreeItems(options);

      addTreeItems(newTreeItems, parentIndex);
    },

    async loadArrayTreeItems(options) {
      const { index: parentIndex } = options.item;

      const newTreeItems = await arrayLoader.loadArrayTreeItems(options);

      addTreeItems(newTreeItems, parentIndex);
    },

    updatePropertyKey(index: TreeItemIndex, key?: string) {
      treeValues.renameKey(index, key);
    },

    updatePropertyValue(index: TreeItemIndex, value?: unknown) {
      treeValues.updateValue(index, value);

      showTreeItemValues(rootIndex);
    },

    removeProperty(index: TreeItemIndex) {
      const treeItem = treeItems[index];
      const { parentIndex } = treeItem.data;
      const parentItem = treeItems[parentIndex];

      treeValues.removeKey(treeItem);

      removeTreeItem(index, parentIndex);

      if (isTreeItemDataArray(parentItem)) {
        parentItem.children?.forEach((childIndex, arrIndex) => {
          treeValues.renameKey(childIndex, String(arrIndex));
        });
      }
    },

    async changeItemType(index, variantSchemaNode) {
      const existingItem = getTreeItem(index);

      // No need to change type as it is the same variant
      if (
        variantSchemaNode.variantId ===
        existingItem.data.variantSchemaNode?.variantId
      ) {
        return;
      }

      const {
        data: { parentIndex, value: _existingValue, key, baseSchemaNode },
      } = existingItem;

      const existingPosition = getPosition(index);

      // remove old tree item before creating a new one with changed type (variant)
      actions.removeProperty(index);

      const newTreeItem = await treeItemFactory.createTreeItem({
        baseSchemaNode,
        variantSchemaNode,
        key,
        parentIndex,
      });

      addTreeItem(newTreeItem, parentIndex, existingPosition);
      showTreeItemValues(rootIndex);
    },

    moveItem(index, dir) {
      const parentItem = getParentTreeItem(index);
      const { children = [], index: parentIndex } = parentItem;
      const pos = children.indexOf(index);

      if (dir === "up" && pos > 0) {
        if (isTreeItemDataArray(parentItem)) {
          treeValues.swapArrayKeys(parentIndex, pos, pos - 1);
        }
        [children[pos - 1], children[pos]] = [children[pos], children[pos - 1]];
      } else if (dir === "down" && pos < children.length - 1) {
        if (isTreeItemDataArray(parentItem)) {
          treeValues.swapArrayKeys(parentIndex, pos, pos + 1);
        }
        [children[pos + 1], children[pos]] = [children[pos], children[pos + 1]];
      }
    },

    getTopLevelItems() {
      return getChildren(rootIndex);
    },

    getTopLevelItem(name) {
      return getChildren(rootIndex).find((item) => item.index === name);
    },

    getJsonWithMetadata(name: TreeItemIndex): JsonWithMetadata {
      const {
        data: { value, metadata },
      } = treeItems[name];

      const jsonSchemaMetadata: JsonWithMetadata["metadata"] = {};

      if (metadata) {
        for (const [keyPath, metaValue] of metadata) {
          const treeItemData = treeItems[metaValue.index].data;
          const { schemaNode } = treeItemData;

          const metaSchema = isSchemaNodeParams(schemaNode)
            ? schemaNode.parent.schema
            : schemaNode.schema;

          jsonSchemaMetadata[keyPath.join(".")] = { schema: metaSchema };
        }
      }

      return {
        value: value as JSONObject,
        metadata: jsonSchemaMetadata,
      };
    },
  };

  return {
    actions,
  };
}
