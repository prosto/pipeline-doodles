import type { JSONSchema } from "./types";

export function changeSchema(
  schema: JSONSchema,
  properties: Partial<JSONSchema>,
): JSONSchema {
  return Object.assign(schema, properties);
}

export function changeSchemaId(schema: JSONSchema, $id: string): JSONSchema {
  return changeSchema(schema, { $id });
}
