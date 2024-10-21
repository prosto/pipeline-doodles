import { proxy, ref } from "valtio";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import { storeContext } from "../store-context";
import type { SchemaTreeItem, TreeItemDataArray } from "../types";

type ArrayItemEntryType = "items" | "dynamicItems";

export interface ArrayItemEntry {
  entryId: string;
  title?: string;
  type: ArrayItemEntryType;
  nodeRef: SchemaNodeDescriptor;
}

export interface TreeItemArrayControls {
  state: {
    selectedId?: string;

    readonly selected?: ArrayItemEntry;
    readonly selectedTitle: string;

    readonly allItems: ArrayItemEntry[];
    readonly items: ArrayItemEntry[];
    readonly dynamicItems: ArrayItemEntry[];

    readonly isVisible: boolean;
  };

  actions: {
    setSelected: (id: string) => void;

    addSelected: () => void;
  };
}

interface ArrayControlsFactoryProps {
  treeItem: SchemaTreeItem<TreeItemDataArray>;
}

export function treeItemArrayControlsFactory({
  treeItem,
}: ArrayControlsFactoryProps): TreeItemArrayControls {
  const {
    schemaTree: {
      actions: { addTreeItemForNode },
    },
  } = storeContext.useX();

  const {
    data: { schemaNode },
  } = treeItem;

  const convertToArrayItemEntries = (
    schemaNodes: SchemaNodeDescriptor[],
    type: ArrayItemEntryType,
  ): ArrayItemEntry[] => {
    return schemaNodes.map((node) => ({
      entryId: node.id,
      title: String(node.propertyName || node.title || node.schema.type),
      type,
      nodeRef: ref(node),
    }));
  };

  const state: TreeItemArrayControls["state"] = proxy({
    selectedId: undefined,

    items: convertToArrayItemEntries(schemaNode.items, "items"),

    dynamicItems: convertToArrayItemEntries(
      schemaNode.dynamicItems,
      "dynamicItems",
    ),

    get allItems() {
      return [...state.items, ...state.dynamicItems];
    },

    get selected() {
      return this.allItems.find(({ entryId }) => entryId === state.selectedId);
    },

    get selectedTitle() {
      return state.selected?.title ?? "select ...";
    },

    get isVisible() {
      return state.allItems.length > 0;
    },
  });

  function getFirstAvailable(): string | undefined {
    return state.allItems[0]?.entryId;
  }

  const actions: TreeItemArrayControls["actions"] = {
    setSelected(entryId) {
      state.selectedId = entryId;
    },

    addSelected() {
      const { selected } = state;
      if (selected) {
        void addTreeItemForNode({
          schemaNode: selected.nodeRef,
          parentIndex: treeItem.index,
        });
      }
    },
  };

  state.selectedId = getFirstAvailable();

  return { state, actions };
}
