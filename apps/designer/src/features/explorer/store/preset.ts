import type { SchemaId } from "@repo/node-specs/types";
import type { TreeItem, TreeItemIndex } from "react-complex-tree";
import { proxy } from "valtio";

import {
  schemaBundleTreeItem,
  schemaDataProvider,
} from "./schema-data-provider";
import type {
  ExTreeDataProvider,
  Preset,
  PresetTreeItem,
  PresetTreeViewState,
  TreeItemSchema,
  TreeItemSchemaBundle,
} from "./types";

const ROOT_ITEM_INDEX = "root";

const DEFAULT_VIEW_STATE = {
  selectedItems: [],
  expandedItems: [],
  focusedItem: ROOT_ITEM_INDEX,
};

function rootWithChildren(children: TreeItemIndex[]): PresetTreeItem {
  return {
    index: ROOT_ITEM_INDEX,
    children,
    data: {
      type: "root",
      title: "Root",
      canDrag: false,
    },
    isFolder: true,
    canMove: false,
    canRename: false,
  };
}

function indexedTreeItems(
  treeItems: PresetTreeItem[],
): Record<TreeItemIndex, PresetTreeItem> {
  return Object.fromEntries(treeItems.map((item) => [item.index, item]));
}

function initialTreeItemsFactory(
  treeItems: PresetTreeItem[] = [],
): Record<TreeItemIndex, PresetTreeItem> {
  const root: PresetTreeItem = rootWithChildren(
    treeItems.map((item) => item.index),
  );

  return {
    [ROOT_ITEM_INDEX]: root,
    ...indexedTreeItems(treeItems),
  };
}

interface PresetFactoryProps {
  id: string;
  title: string;
  dataProvider: ExTreeDataProvider;
  initialTreeItems: PresetTreeItem[];
  rootItem?: string;
  viewState?: Partial<PresetTreeViewState>;
}

export function presetFactory({
  id,
  title,
  dataProvider,
  initialTreeItems = [],
  rootItem = ROOT_ITEM_INDEX,
  viewState: viewStateSettings,
}: PresetFactoryProps): Preset {
  const viewState = proxy({
    ...DEFAULT_VIEW_STATE,
    ...viewStateSettings,
  });

  const state: Preset["state"] = proxy({
    id,
    title,
    items: initialTreeItemsFactory(initialTreeItems),
    rootItem,
    viewState,
  });

  function loadMissingItems(itemsToLoad: TreeItemIndex[]): void {
    const missingItems = itemsToLoad.map((item) =>
      dataProvider.getTreeItemSync(item),
    );
    state.items = {
      ...state.items,
      ...indexedTreeItems(missingItems),
    };
  }

  // Preload expanded items (its children) in case specified
  for (const expandedItem of viewState.expandedItems) {
    if (Object.hasOwn(state.items, expandedItem)) {
      loadMissingItems(state.items[expandedItem].children ?? []);
    }
  }

  const actions: Preset["actions"] = {
    loadMissingItems,

    collapseItem(item: PresetTreeItem) {
      viewState.expandedItems = viewState.expandedItems.filter(
        (expandedItemIndex) => expandedItemIndex !== item.index,
      );
    },

    expandItem(item: PresetTreeItem) {
      viewState.expandedItems = [...viewState.expandedItems, item.index];
    },

    selectItems(items: TreeItemIndex[]) {
      viewState.selectedItems = items;
    },

    focusItem(item: PresetTreeItem) {
      viewState.focusedItem = item.index;
    },
  };

  return {
    state,
    actions,
  };
}

interface SchemaBundlePresetFactoryProps {
  id: string;
  title: string;
  bundleIds: SchemaId[];
  rootItem?: string;
  viewState?: Partial<PresetTreeViewState>;
}

export function schemaBundlePresetFactory({
  id,
  title,
  bundleIds,
  rootItem,
  viewState,
}: SchemaBundlePresetFactoryProps): Preset {
  return presetFactory({
    id,
    title,
    dataProvider: schemaDataProvider(),
    initialTreeItems: bundleIds.map((bundleId) =>
      schemaBundleTreeItem(bundleId),
    ),
    rootItem,
    viewState,
  });
}

export function isSchemaPresetItem(
  item: PresetTreeItem,
): item is TreeItem<TreeItemSchema> {
  return item.data.type === "schema";
}

export function isSchemaBundlePresetItem(
  item: PresetTreeItem,
): item is TreeItem<TreeItemSchemaBundle> {
  return item.data.type === "schema-bundle";
}
