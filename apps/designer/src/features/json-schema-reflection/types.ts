import type { JSONSchema } from "@repo/json-schema";

export interface SchemaPropertyDescriptor<T extends JSONSchema = JSONSchema> {
  id: string;
  name?: string;

  title?: string;
  description?: string;
  defaultValue?: unknown;

  schema: T;
  parentSchema?: JSONSchema;
  refPath?: string;

  pyType?: string;
  readonly pyTypeSimple?: string;

  isResolved: boolean;
  isOptional: boolean;
  isAdditional: boolean;
}
