import type { AnyValidateFunction, JSONSchema } from "@repo/json-schema";
import { ajvFactory } from "@repo/json-schema";
import { nodeJsonSchemaReader } from "@repo/node-specs/registry";
import { ensureIsDefined } from "@repo/shared/utils";

const ajv = ajvFactory({
  allErrors: true,
  validateSchema: true,
  loadSchema,
});

async function loadSchema(uri: string): Promise<JSONSchema> {
  const reader = nodeJsonSchemaReader();
  const [schema] = await reader.resolveWithSchema(uri);
  return schema;
}

interface SchemaWithKey {
  schema: JSONSchema;
  key?: string;
}

export async function retrieveValidator({
  schema,
  key,
}: SchemaWithKey): Promise<AnyValidateFunction<unknown>> {
  const keyRef = String(schema.$id ?? key);

  const validateFn = ajv.getSchema(keyRef);

  if (validateFn) {
    return validateFn;
  }

  if (schema.$id) {
    return ajv.compileAsync(schema);
  }

  ajv.addSchema(schema, keyRef);
  return ensureIsDefined(ajv.getSchema(keyRef));
}

export async function isSchemaValid({
  value,
  schemaWithKey,
}: {
  value: unknown;
  schemaWithKey: SchemaWithKey;
}): Promise<boolean> {
  const validator = await retrieveValidator(schemaWithKey);

  const valid = await validator(value);

  return Boolean(valid);
}
