import { proxy, ref, subscribe } from "valtio";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import { storeContext } from "../store-context";
import type { SchemaTreeItem, TreeItemDataObject } from "../types";

type PropertyType = "optional" | "additional" | "dynamic";

export interface PropertyEntry {
  propertyId: string;
  title?: string;
  type: PropertyType;
  readonly nodeRef: SchemaNodeDescriptor;
}

export interface TreeItemObjectControls {
  state: {
    selectedId?: string;
    selectedType?: PropertyType;

    readonly selectedEntry?: PropertyEntry;
    readonly selectedTitle: string;

    optionalProperties: PropertyEntry[];
    additionalProperties: PropertyEntry[];
    dynamicProperties: PropertyEntry[];
    readonly allProperties: PropertyEntry[];

    readonly isVisible: boolean;
  };

  actions: {
    setSelected: (entryId: string) => void;

    addSelected: () => Promise<void>;
  };
}

interface ObjectControlsFactoryProps {
  treeItem: SchemaTreeItem<TreeItemDataObject>;
}

export function treeItemObjectControlsFactory({
  treeItem,
}: ObjectControlsFactoryProps): TreeItemObjectControls {
  const {
    schemaTree: {
      actions: { addTreeItemForNode },
    },
  } = storeContext.useX();

  const { children = proxy([]), data: treeItemData } = treeItem;
  const { schemaNode } = treeItemData;

  const convertToEntries = (
    schemaNodes: SchemaNodeDescriptor[],
    type: PropertyType,
  ): PropertyEntry[] => {
    return schemaNodes.map((node) => ({
      propertyId: node.id,
      title: String(node.propertyName || node.title || node.schema.type),
      type,
      nodeRef: ref(node),
    }));
  };

  const state: TreeItemObjectControls["state"] = proxy({
    selectedId: undefined,

    optionalProperties: convertToEntries(
      treeItemData.nonConsumedProperties,
      "optional",
    ),

    additionalProperties: convertToEntries(
      schemaNode.additionalProperties,
      "additional",
    ),

    dynamicProperties: convertToEntries(
      schemaNode.dynamicProperties,
      "dynamic",
    ),

    get allProperties() {
      return [
        ...state.optionalProperties,
        ...state.additionalProperties,
        ...state.dynamicProperties,
      ];
    },

    get selectedEntry() {
      return this.allProperties.find(
        ({ propertyId }) => propertyId === state.selectedId,
      );
    },

    get selectedTitle() {
      return state.selectedEntry?.title ?? "select ...";
    },

    get isVisible() {
      return this.allProperties.length > 0;
    },
  });

  function getFirstAvailable(): string | undefined {
    const { allProperties } = state;
    return allProperties[0]?.propertyId;
  }

  function refreshProperties(): void {
    state.optionalProperties = convertToEntries(
      treeItemData.nonConsumedProperties,
      "optional",
    );

    if (!state.selectedId) {
      state.selectedId = getFirstAvailable();
    }
  }

  const actions: TreeItemObjectControls["actions"] = {
    setSelected(entryId) {
      state.selectedId = entryId;
    },

    async addSelected() {
      const { selectedEntry } = state;
      if (selectedEntry) {
        // If adding an optional property - let the logic choose the next selected property
        if (selectedEntry.type === "optional") {
          state.selectedId = undefined;
        }

        await addTreeItemForNode({
          schemaNode: selectedEntry.nodeRef,
          parentIndex: treeItem.index,
        });
      }
    },
  };

  subscribe(children, () => {
    refreshProperties();
  });

  refreshProperties();

  return { state, actions };
}
