import { isDefined } from "@repo/shared/utils";

import type { JSONSchema } from "./types";

const primitiveTypes = ["number", "integer", "string", "boolean"];

export function isJsonSchema(schema: unknown): schema is JSONSchema {
  return isDefined(schema) && typeof schema === "object";
}

export function isPrimitiveJsonSchema(schema: unknown): boolean {
  return (
    isJsonSchema(schema) &&
    typeof schema.type === "string" &&
    primitiveTypes.includes(schema.type)
  );
}
