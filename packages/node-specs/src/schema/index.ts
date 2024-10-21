import type {
  SchemaBaseUri,
  SchemaBundle,
  SchemaId,
} from "@repo/node-specs/types";

export const BASE_URI: SchemaBaseUri = "https://haystack.deepset.ai";

export function schemaId(uriPath: SchemaId): SchemaId {
  if (uriPath.startsWith(BASE_URI)) {
    return uriPath;
  } else if (uriPath.startsWith("/")) {
    return `${BASE_URI}${uriPath}` as SchemaId;
  }
  throw new Error(`schema uriPath is invalid ${uriPath}`);
}

export function bundleId(uriPath: SchemaId): SchemaId {
  return schemaId(uriPath);
}

export function schemaBundle({
  $id,
  schemas,
  ...other
}: SchemaBundle): SchemaBundle {
  if (schemas.length === 0) {
    throw new Error("SchemaSet should contain at least one schema definition");
  }

  return {
    $id,
    schemas,
    ...other,
  };
}
