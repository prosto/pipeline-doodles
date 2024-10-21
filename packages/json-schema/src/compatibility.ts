import type { JSONSchema } from "./types";

const primitiveTypes = ["string", "number", "integer", "boolean"];

function isPrimitiveType(type: JSONSchema["type"]): boolean {
  return (
    Boolean(type) && typeof type === "string" && primitiveTypes.includes(type)
  );
}

function isObject(schema: unknown): schema is JSONSchema {
  return typeof schema === "object";
}

export function isSchemaCompatible(
  sourceSchema: JSONSchema,
  targetSchema: JSONSchema,
): boolean {
  if (
    isPrimitiveType(sourceSchema.type) &&
    isPrimitiveType(targetSchema.type) &&
    sourceSchema.type === targetSchema.type
  ) {
    return true;
  }

  if (targetSchema.anyOf) {
    return (
      targetSchema.anyOf.find((schema) =>
        isSchemaCompatible(sourceSchema, schema as JSONSchema),
      ) !== undefined
    );
  }

  if (sourceSchema.anyOf) {
    return (
      sourceSchema.anyOf.find((schema) =>
        isSchemaCompatible(schema as JSONSchema, targetSchema),
      ) !== undefined
    );
  }

  if (sourceSchema.type === "array" && targetSchema.type === "array") {
    if (isObject(sourceSchema.items) && isObject(targetSchema.items)) {
      return isSchemaCompatible(sourceSchema.items, targetSchema.items);
    }
    return true;
  }

  if (sourceSchema.$id && sourceSchema.$id === targetSchema.$id) {
    return true;
  }

  if (sourceSchema.$ref && sourceSchema.$ref === targetSchema.$ref) {
    return true;
  }

  return false;
}
