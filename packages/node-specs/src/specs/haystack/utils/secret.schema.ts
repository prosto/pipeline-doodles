import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/utils/auth/secret"),
  title: "Secret",
  description: "Encapsulates a secret used for authentication.",
  anyOf: [{ $ref: schemaId("/haystack/utils/auth/env-var-secret") }],
  __pyType: "Secret",
  __pyModule: "haystack.utils.auth",
  __nodeType: "protocol",

  __defaultSchema: schemaId("/haystack/utils/auth/env-var-secret"),
};
