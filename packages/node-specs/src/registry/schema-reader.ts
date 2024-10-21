import { schemaReader } from "@repo/json-schema";
import type { SchemaReader, SchemaReaderParams } from "@repo/json-schema/types";

import { registryResolver } from "./registry-resolver";

export function nodeJsonSchemaReader(
  params: SchemaReaderParams = {},
): SchemaReader {
  const options = {
    resolve: { registry: registryResolver },
    mutateInputSchema: false,
    ...params.options,
  };

  return schemaReader({
    ...params,
    options,
  });
}
