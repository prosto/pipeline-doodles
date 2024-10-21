/* eslint-disable no-console -- used for logging messages */

import { ajvFactory } from "@repo/json-schema";
import type { Ajv2020 } from "@repo/json-schema";

import { getMatchingSchemas } from "@/registry";
import { BASE_URI } from "@/schema";
import type { NodeJsonSchema } from "@/types";

function logMessage(message: string): void {
  console.log(message);
}

function logError(message: string, error: unknown): void {
  console.error(message, error);
  console.dir(error);
}

function getSchemaPathsArg(): string[] {
  return process.argv.slice(2);
}

function compileSchema(ajv: Ajv2020, schema: NodeJsonSchema): string[] {
  const errorMessages: string[] = [];
  try {
    ajv.compile(schema);
  } catch (error) {
    errorMessages.push(String(error));
  }
  return errorMessages;
}

function validateSchema(ajv: Ajv2020, schema: NodeJsonSchema): string[] {
  const errorMessages: string[] = [];

  const isValid = ajv.validateSchema(schema);

  if (!isValid) {
    for (const { instancePath, message } of ajv.errors || []) {
      errorMessages.push(`path: ${instancePath} message: ${message}`);
    }
  }
  return errorMessages;
}

function validateSchemas(): void {
  try {
    const schemaPaths = getSchemaPathsArg();
    const foundSchemas = getMatchingSchemas(BASE_URI, schemaPaths);

    if (foundSchemas.length === 0) {
      return;
    }

    const ajv = ajvFactory({
      validateSchema: false, // we will call ajv.validateSchema for each schema
    });

    // Adding all schemas at once so that during compilation we could resolve all $refs
    ajv.addSchema(foundSchemas);

    logMessage(`Found ${foundSchemas.length} schemas. Starting validation...`);

    const invalidSchemas = [];

    for (const schema of foundSchemas) {
      const validationErrors = validateSchema(ajv, schema);
      const compilationErrors = compileSchema(ajv, schema);

      const isValid =
        validationErrors.length === 0 && compilationErrors.length === 0;

      logMessage(
        `Schema validation result: ${schema.$id}: ${isValid ? "OK" : "ERROR"}`,
      );

      if (!isValid) {
        invalidSchemas.push(schema);

        validationErrors.forEach((error) => {
          logMessage(`  || Validation Error  || ${error}`);
        });

        compilationErrors.forEach((error) => {
          logMessage(`  || Compilation Error || ${error}`);
        });
      }
    }

    if (invalidSchemas.length > 0) {
      logMessage(
        `!!! Found ${invalidSchemas.length} INVALID schemas. Make sure those are valid.`,
      );
    }
  } catch (error) {
    logError("Error while running schema validation:", error);
  }
}

validateSchemas();
