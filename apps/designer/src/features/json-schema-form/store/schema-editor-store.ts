import type { TreeItemIndex } from "react-complex-tree";

import { treeDataProviderFactory } from "@/features/complex-tree/tree-data-provider";
import { treeViewStateFactory } from "@/features/complex-tree/tree-view-state";
import { schemaTypeReflectionFactory } from "@/features/json-schema-reflection";

import { schemaTreeFactory } from "./schema-tree";
import { schemaTreeItemsFactory } from "./schema-tree-items";
import { schemaTreeMetadataFactory } from "./schema-tree-metadata";
import { schemaTreeSync } from "./schema-tree-sync";
import { schemaTreeValuesFactory } from "./schema-tree-values";
import { schemaValidationFactory } from "./schema-validation/schema-validation";
import { storeContext } from "./store-context";
import { treeItemDataFactory } from "./tree-item-data-factory";
import {
  treeItemsArrayLoader,
  treeItemsObjectLoader,
} from "./tree-items-loader";
import type {
  SchemaEditorSettings,
  SchemaEditorStore,
  TopLevelSchema,
} from "./types";

export interface SchemaEditorStoreFactory {
  settings?: SchemaEditorSettings;
}

const defaultSettings: SchemaEditorSettings = {
  showTopLevelItems: false,
  showTopLevelToolbar: false,
  expandTopLevelItems: true,

  objectLoaderOptions: {
    hideOptional: true,
  },
};

export function schemaEditorStoreFactory({
  settings = defaultSettings,
}: SchemaEditorStoreFactory): SchemaEditorStore {
  const processingSchemas = new Map<string, TopLevelSchema>();

  const context = storeContext.init(
    {
      settings,
    },
    (bind) => {
      const {
        state: { treeItems },
      } = bind("treeItems", schemaTreeItemsFactory);

      bind("dataProvider", () => treeDataProviderFactory(treeItems));
      bind("treeMetadata", schemaTreeMetadataFactory);
      bind("treeValues", schemaTreeValuesFactory);
      bind("treeViewState", treeViewStateFactory);
      bind("treeItemFactory", treeItemDataFactory);
      bind("objectLoader", treeItemsObjectLoader);
      bind("arrayLoader", treeItemsArrayLoader);
      bind("schemaTypeReflection", schemaTypeReflectionFactory);
      bind("schemaTree", schemaTreeFactory);
      bind("schemaValidation", schemaValidationFactory);
    },
  );

  // Propagate updates from treeItems to actual react Tree component
  storeContext.run(context, schemaTreeSync);

  const { schemaTree, treeViewState } = context;
  const { getTopLevelItem, addTopLevelItem } = schemaTree.actions;

  function expandItem(index: TreeItemIndex): void {
    const { expandedItems } = treeViewState.viewState;
    if (expandedItems && !expandedItems.includes(index)) {
      expandedItems.push(index);
    }
  }

  return {
    state: {
      context,
      rootIndex: "root",
    },

    actions: {
      async loadEditorSchemas({ schemas }): Promise<void> {
        async function loadSchema(schema: TopLevelSchema): Promise<void> {
          if (!processingSchemas.has(schema.name)) {
            const existingItem = getTopLevelItem(schema.name);
            if (!existingItem) {
              processingSchemas.set(schema.name, schema);

              const { index } = await addTopLevelItem(schema);

              if (settings.expandTopLevelItems) {
                expandItem(index);
              }

              processingSchemas.delete(schema.name);
            }
          }
        }

        await Promise.all(schemas.map((schema) => loadSchema(schema)));
      },
    },
  };
}
