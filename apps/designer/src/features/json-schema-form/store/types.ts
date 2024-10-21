import type {
  JSONSchema,
  JSONValue,
  JsonWithMetadata,
} from "@repo/json-schema";
import type { TrieMap } from "@repo/shared/utils";
import type {
  StaticTreeDataProvider,
  TreeInformation,
  TreeItem,
  TreeItemIndex,
  TreeItemRenderContext,
} from "react-complex-tree";

import type {
  TreeDataProvider,
  TreeViewState,
} from "@/features/complex-tree/types";
import type {
  SchemaNodeArray,
  SchemaNodeDescriptor,
  SchemaNodeObject,
  SchemaNodeProtocol,
  SchemaNodeUnion,
  SchemaTypeReflection,
} from "@/features/json-schema-reflection";

import type { SchemaValidation } from "./schema-validation/types";
import type { TreeItemDataFactory } from "./tree-item-data-factory/types";
import type {
  TreeItemsArrayLoader,
  TreeItemsObjectLoader,
} from "./tree-items-loader/types";

export interface TreeItemMetadataValue {
  index: TreeItemIndex;
}

export type TreeItemMetadata = TrieMap<string, TreeItemMetadataValue>;

interface WithLoadingState {
  loadingState: {
    isLoaded?: boolean;
    isLoading?: boolean;
  };
}

export interface TreeItemData {
  type: string;
  parentIndex: TreeItemIndex;
  metadata?: TreeItemMetadata;
  key?: string;
  value?: unknown;
  initialValue?: unknown;
  defaultValue?: unknown;
  valueSource?: "default" | "initial";

  isHidden?: boolean;
  readonly isTopLevel: boolean;
  readonly canRemove: boolean;
  readonly canEditKey: boolean;
  readonly isAdditional?: boolean;
  readonly isOptional: boolean;
  readonly isComplexObject: boolean;
  readonly isArrayValue: boolean;

  readonly propertyName?: string;
  readonly title?: string;
  readonly description?: string;

  readonly schema: JSONSchema;
  readonly baseSchemaNode: SchemaNodeDescriptor; // represents main schema being processed
  readonly variantSchemaNode?: SchemaNodeDescriptor; // serves as specific discriminant in case of several schema options (e.g. union)
  readonly schemaNode: SchemaNodeDescriptor; // resolves to variantSchemaNode if present otherwise returns baseSchemaNode
  readonly schemaType: JSONSchema["type"]; // will return variant specific (if any) schema type (e.g. "number", "string")
  readonly parentSchemaType?: JSONSchema["type"];
}

export interface TreeItemDataObject extends TreeItemData, WithLoadingState {
  type: "schema-data-object";
  readonly schemaNode: SchemaNodeObject;
  readonly consumedProperties: string[];
  readonly nonConsumedProperties: SchemaNodeDescriptor[];
  readonly freeOptionalProperties: SchemaNodeDescriptor[];
}

export interface TreeItemDataArray extends TreeItemData, WithLoadingState {
  type: "schema-data-array";
  readonly schemaNode: SchemaNodeArray;
}

export interface TreeItemDataPrimitive extends TreeItemData {
  type: "schema-data-primitive";
}

export interface TreeItemDataConst extends TreeItemData {
  type: "schema-data-const";
}

export interface TreeItemDataProtocol extends TreeItemData {
  type: "schema-data-protocol";
  readonly schemaNode: SchemaNodeProtocol;
}

export interface TreeItemDataUnion extends TreeItemData {
  type: "schema-data-union";
  readonly schemaNode: SchemaNodeUnion;
}

export type SchemaTreeItem<T extends TreeItemData = TreeItemData> = TreeItem<T>;

export type RootTreeItem = TreeItem<{
  type: "root";
  value?: unknown;
}> & { index: "root" };

export interface SchemaTreeMetadata {
  metaKey: (index: TreeItemIndex, key?: string) => string;

  getMetadata: (
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
  ) => TreeItemMetadata;

  removeMetadata: (treeItemOrIndex: SchemaTreeItem | TreeItemIndex) => void;

  renameKey: (index: TreeItemIndex, oldKey?: string, newKey?: string) => void;

  assignMetadata: (treeItemOrIndex: SchemaTreeItem | TreeItemIndex) => void;
}

export interface SchemaTreeValues {
  updateValue: (
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
    value?: unknown,
  ) => void;

  removeKey: (treeItemOrIndex: SchemaTreeItem | TreeItemIndex) => void;

  renameKey: (index: TreeItemIndex, newKey?: string) => void;

  getValue: <T = JSONValue>(index?: TreeItemIndex) => T;

  getParentValue: (index: TreeItemIndex) => object;

  updateParentValue: (
    parentIndex: TreeItemIndex,
    key: string,
    value?: unknown,
  ) => void;

  swapArrayKeys: (index: TreeItemIndex, posFrom: number, posTo: number) => void;
}

export interface SchemaTreeItems {
  state: {
    treeItems: Record<TreeItemIndex, SchemaTreeItem>;
  };

  actions: {
    getTreeItem: (
      treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
    ) => SchemaTreeItem;

    getParentTreeItem: (
      treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
    ) => SchemaTreeItem;

    getChildren: (
      treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
    ) => SchemaTreeItem[];

    addTreeItem: (
      treeItem: SchemaTreeItem,
      explicitParentIndex?: TreeItemIndex,
      pos?: number,
    ) => SchemaTreeItem;

    getPosition: (index: TreeItemIndex) => number;

    addTreeItems: (
      items: SchemaTreeItem[],
      explicitParentIndex?: TreeItemIndex,
    ) => void;

    removeTreeItem: (index: TreeItemIndex, parentIndex: TreeItemIndex) => void;

    updateItemData: <T extends TreeItemData>(
      index: TreeItemIndex,
      data: Partial<T>,
    ) => void;

    updateItemDataByKey: <T extends TreeItemData>(
      parentIndex: TreeItemIndex,
      key: string,
      data: Partial<T>,
    ) => void;
  };
}

export interface TreeItemsDataProvider {
  dataProvider: StaticTreeDataProvider<TreeItemData>;

  notifyChanges: (...indexes: (TreeItemIndex | undefined)[]) => void;
}

export interface TopLevelSchema {
  schema: JSONSchema | string | SchemaNodeDescriptor;
  refPath?: string;
  initialValue?: unknown;
  name: string;
}

export interface SchemaTree {
  actions: {
    addTopLevelItem: (
      topLevelSchema: TopLevelSchema,
    ) => Promise<SchemaTreeItem>;

    addTreeItemForNode: (options: {
      schemaNode: SchemaNodeDescriptor;
      parentIndex: TreeItemIndex;
    }) => Promise<void>;

    loadObjectTreeItems: (options: {
      item: SchemaTreeItem<TreeItemDataObject>;
      optionalProperties?: string[];
    }) => Promise<void>;

    loadArrayTreeItems: (options: {
      item: SchemaTreeItem<TreeItemDataArray>;
    }) => Promise<void>;

    updatePropertyKey: (index: TreeItemIndex, key?: string) => void;

    updatePropertyValue: (index: TreeItemIndex, value?: unknown) => void;

    removeProperty: (index: TreeItemIndex) => void;

    moveItem: (index: TreeItemIndex, dir: "up" | "down") => void;

    changeItemType: (
      index: TreeItemIndex,
      variantSchemaNode: SchemaNodeDescriptor,
    ) => Promise<void>;

    getTopLevelItems: () => SchemaTreeItem[];

    getTopLevelItem: (name: string) => SchemaTreeItem | undefined;

    getJsonWithMetadata: (name: TreeItemIndex) => JsonWithMetadata;
  };
}

export interface SchemaEditorSettings {
  showTopLevelItems?: boolean;
  showTopLevelToolbar?: boolean;
  expandTopLevelItems?: boolean;

  objectLoaderOptions?: {
    hideOptional?: boolean;
    hideDefaults?: boolean;
    include?: string[];
  };
}

export interface SchemaEditorStoreContext extends Record<string, unknown> {
  readonly settings: SchemaEditorSettings;
  readonly treeItems: SchemaTreeItems;
  readonly treeValues: SchemaTreeValues;
  readonly treeMetadata: SchemaTreeMetadata;
  readonly treeViewState: TreeViewState;
  readonly schemaValidation: SchemaValidation;
  readonly schemaTree: SchemaTree;
  readonly treeItemFactory: TreeItemDataFactory;
  readonly dataProvider: TreeDataProvider<TreeItemData>;
  readonly objectLoader: TreeItemsObjectLoader;
  readonly arrayLoader: TreeItemsArrayLoader;
  readonly schemaTypeReflection: SchemaTypeReflection;
}

export interface SchemaEditorStore {
  state: {
    context: SchemaEditorStoreContext;
    readonly rootIndex: string;
  };

  actions: {
    loadEditorSchemas: (options: {
      schemas: TopLevelSchema[];
    }) => Promise<void>;
  };
}

export interface TreeItemRenderProps<T extends TreeItemData = TreeItemData> {
  item: SchemaTreeItem<T>;
  depth: number;
  children: React.ReactNode | null;
  title: React.ReactNode;
  arrow: React.ReactNode;
  context: TreeItemRenderContext;
  info: TreeInformation;
}

export interface SchemaTreeItemContext<T extends TreeItemData = TreeItemData> {
  state: {
    renderProps: TreeItemRenderProps<T>;
    readonly treeItem: SchemaTreeItem<T>;
    readonly treeItemData: T;
  };

  actions: {
    updateRenderProps: (renderProps: TreeItemRenderProps<T>) => void;
  };
}
