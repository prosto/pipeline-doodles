import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as DocumentStore } from "./document_store.schema";
import { schema as InMemoryDocumentStore } from "./in_memory.schema";

export const schemas = [DocumentStore, InMemoryDocumentStore];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/document-stores"),
  title: "Document Stores",
  schemas,
});
