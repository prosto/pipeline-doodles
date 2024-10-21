import { ensureIsDefined, getId, isDefined } from "@repo/shared/utils";

import type { SchemaTreeItem } from "../types";

import { treeItemDataArrayFactory } from "./tree-item-data-array";
import { treeItemDataComponentFactory } from "./tree-item-data-component";
import { treeItemDataConstFactory } from "./tree-item-data-const";
import { treeItemDataDocumentStoreFactory } from "./tree-item-data-document-store";
import { treeItemDataObjectFactory } from "./tree-item-data-object";
import { treeItemDataPrimitiveFactory } from "./tree-item-data-primitive";
import { treeItemDataProtocolFactory } from "./tree-item-data-protocol";
import { treeItemDataUnionFactory } from "./tree-item-data-union";
import type {
  TreeItemFactory,
  TreeItemDataFactory,
  TreeItemFactoryContext,
  StaticTreeItemFactoryContext,
} from "./types";

export function treeItemDataFactory(): TreeItemDataFactory {
  const treeItemFactories: TreeItemFactory[] = [
    treeItemDataComponentFactory(),

    treeItemDataDocumentStoreFactory(),

    treeItemDataProtocolFactory(),

    treeItemDataUnionFactory(),

    treeItemDataConstFactory(),

    treeItemDataArrayFactory(),

    treeItemDataObjectFactory(),

    treeItemDataPrimitiveFactory(),
  ];

  function createFactoryContext({
    baseSchemaNode,
    variantSchemaNode,
    ...rest
  }: StaticTreeItemFactoryContext): TreeItemFactoryContext {
    const schemaNode = variantSchemaNode ?? baseSchemaNode;
    const schema = schemaNode.schema;

    const context = {
      ...rest,
      baseSchemaNode,
      variantSchemaNode,

      schemaNode,
      schema,
      isVariant: isDefined(variantSchemaNode),

      treeItemFactory,

      newContext(ctxData = {}) {
        return createFactoryContext({
          ...context,
          ...ctxData,
        });
      },
    };

    return context;
  }

  async function treeItemFactory(
    context: TreeItemFactoryContext,
  ): Promise<SchemaTreeItem> {
    const matchingFactory = ensureIsDefined(
      treeItemFactories.find((factory) => factory.predicate(context)),
    );

    return matchingFactory.create(context);
  }

  return {
    async createTreeItem({ index = getId(), ...rest }) {
      const context = createFactoryContext({
        index,
        ...rest,
      });

      const treeItem = await treeItemFactory(context);

      return treeItem;
    },
  };
}
