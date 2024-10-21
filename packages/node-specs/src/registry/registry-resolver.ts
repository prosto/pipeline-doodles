import type {
  FileInfo,
  ResolverOptions,
} from "@apidevtools/json-schema-ref-parser/dist/lib/types";
import type { JSONSchema } from "@repo/json-schema/types";
import { assertIsDefined } from "@repo/shared/utils";

import { BASE_URI, schemaId } from "@repo/node-specs/schema";
import type { SchemaId } from "@repo/node-specs/types";

import { hasSchema, getSchema } from "./registry";

export const registryResolver: ResolverOptions = {
  order: 1, // give priority to the registry first

  canRead: (file: FileInfo) => {
    const url = new URL(file.url, BASE_URI);
    const id = schemaId(url.toString() as SchemaId);

    return hasSchema(id);
  },

  read(file): Promise<JSONSchema> {
    const id = schemaId(file.url as SchemaId);
    const schema = getSchema(id);

    assertIsDefined(schema);

    return Promise.resolve(schema);
  },
};
