import type { SchemaValidation } from "../store/schema-validation/types";

import { useSchemaEditorStore } from "./use-schema-editor";

export function useSchemaValidation(): SchemaValidation {
  const {
    state: {
      context: { schemaValidation },
    },
  } = useSchemaEditorStore();

  return schemaValidation;
}
