import type { JSONSchema } from "@repo/json-schema";
import type { TreeItemIndex } from "react-complex-tree";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import type { SchemaTreeItem, TreeItemData } from "../types";

export interface TreeItemFactoryOptions {
  baseSchemaNode: SchemaNodeDescriptor;
  variantSchemaNode?: SchemaNodeDescriptor;
  parentIndex: TreeItemIndex;
  index?: TreeItemIndex;
  key?: string;
  value?: unknown;
  initialValue?: unknown;
  defaultValue?: unknown;
  valueSource?: "initial" | "default";
}

export type StaticTreeItemFactoryContext = TreeItemFactoryOptions & {
  index: TreeItemIndex;
};

export type TreeItemFactoryContext<
  T extends SchemaNodeDescriptor = SchemaNodeDescriptor,
> = StaticTreeItemFactoryContext & {
  readonly schemaNode: T;
  readonly schema: JSONSchema;
  readonly isVariant: boolean;

  treeItemFactory: (ctx: TreeItemFactoryContext) => Promise<SchemaTreeItem>;

  newContext: (
    ctx?: Partial<StaticTreeItemFactoryContext>,
  ) => TreeItemFactoryContext;
};

export interface TreeItemDataFactory {
  createTreeItem: (props: TreeItemFactoryOptions) => Promise<SchemaTreeItem>;
}

export interface TreeItemFactory<T extends TreeItemData = TreeItemData> {
  predicate: (ctx: TreeItemFactoryContext) => boolean;

  create: (
    ctx: TreeItemFactoryContext,
  ) => Promise<SchemaTreeItem<T>> | SchemaTreeItem<T>;
}
