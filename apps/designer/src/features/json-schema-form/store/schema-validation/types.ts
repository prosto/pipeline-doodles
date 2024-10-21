import type { JSONSchema } from "@repo/json-schema";
import type { TreeItemIndex } from "react-complex-tree";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";
import type {
  FieldValues,
  ResolverOptions,
  ValidateResult,
} from "@repo/ui/form";

export interface ValidationOptions<TFieldValues extends FieldValues> {
  schema: JSONSchema;
  key?: string;
  values: TFieldValues;
  options: ResolverOptions<TFieldValues>;
}

export interface SchemaValidation {
  validateFieldValue: (options: {
    value: unknown;
    schemaNode: SchemaNodeDescriptor;
  }) => Promise<ValidateResult>;

  validateSchemaValues: (options: { name: string }) => Promise<unknown>;

  isValidKey: (index: TreeItemIndex, key: string) => boolean;
}
