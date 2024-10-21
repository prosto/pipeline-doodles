import type { JSONSchema } from "@repo/json-schema";

import { bundle as rootBundle } from "@repo/node-specs/specs";
import type {
  NodeJsonSchema,
  SchemaBundle,
  SchemaId,
} from "@repo/node-specs/types";

export const schemaRegistry = new Map<SchemaId, NodeJsonSchema>();
export const bundleRegistry = new Map<SchemaId, SchemaBundle>();

collectAllSchemas(rootBundle, bundleRegistry, schemaRegistry);

export function isBundle(
  schema: NodeJsonSchema | SchemaBundle,
): schema is SchemaBundle {
  return "schemas" in schema;
}

export function getSchema<T extends JSONSchema>(id: SchemaId): T | undefined {
  return schemaRegistry.get(id) as T | undefined;
}

export function getSchemaRegistry(): Map<SchemaId, JSONSchema> {
  return schemaRegistry;
}

export function hasSchema(id: SchemaId): boolean {
  return Boolean(getSchema(id));
}

export function getBundle(id: SchemaId): SchemaBundle | undefined {
  return bundleRegistry.get(id);
}

export function getMatchingSchemas(
  baseUri: string,
  uriPaths: string[],
): NodeJsonSchema[] {
  if (uriPaths.length === 0) {
    return [];
  }

  const matchingSchemas: NodeJsonSchema[] = [];

  for (const [schemaId, schema] of schemaRegistry.entries()) {
    const idWithoutBaseUri = schemaId.replace(baseUri, "");

    const hasMatching = Boolean(
      uriPaths.find((uriPath) =>
        idWithoutBaseUri.startsWith(uriPath.replace(baseUri, "")),
      ),
    );
    if (hasMatching) {
      matchingSchemas.push(schema);
    }
  }

  return matchingSchemas;
}

function collectAllSchemas(
  bundle: SchemaBundle,
  bundles: Map<SchemaId, SchemaBundle>,
  schemas: Map<SchemaId, JSONSchema>,
): void {
  for (const schemaOrBundle of bundle.schemas) {
    if (isBundle(schemaOrBundle)) {
      bundles.set(schemaOrBundle.$id, schemaOrBundle);
      collectAllSchemas(schemaOrBundle, bundles, schemas);
    } else {
      schemas.set(schemaOrBundle.$id, schemaOrBundle);
    }
  }
}
