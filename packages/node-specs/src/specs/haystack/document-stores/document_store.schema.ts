import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/document-stores/document-store"),
  title: "DocumentStore",
  description: "Stores Documents to be used by the components of a Pipeline.",
  __pyType: "DocumentStore",
  __pyModule: "haystack.document_stores.types",
  __nodeType: "protocol",

  __defaultSchema: schemaId("/haystack/document-stores/in-memory"),
};
