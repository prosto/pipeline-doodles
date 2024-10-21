import type { SchemaEditorSettings } from "../store/types";

import { useSchemaEditorStore } from "./use-schema-editor";

export function useSchemaEditorSettings(): SchemaEditorSettings {
  const {
    state: {
      context: { settings },
    },
  } = useSchemaEditorStore();

  return settings;
}
