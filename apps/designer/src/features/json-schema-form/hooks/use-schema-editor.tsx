import { useContext } from "react";

import { SchemaEditorContext } from "../providers/schema-editor-provider";
import type {
  SchemaEditorStore,
  SchemaEditorStoreContext,
  SchemaTree,
} from "../store/types";

export function useSchemaEditorStore(): SchemaEditorStore {
  const store = useContext(SchemaEditorContext);

  if (store === undefined) {
    throw new Error(
      "useSchemaEditorStore can only be used in a SchemaEditorProvider tree",
    );
  }

  return store;
}

export function useSchemaEditorStoreContext(): SchemaEditorStoreContext {
  const store = useSchemaEditorStore();
  return store.state.context;
}

export function useSchemaTree(): SchemaTree {
  const {
    state: {
      context: { schemaTree },
    },
  } = useSchemaEditorStore();

  return schemaTree;
}
