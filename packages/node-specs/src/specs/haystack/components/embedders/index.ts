import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as SentenceTransformersDocumentEmbedder } from "./sentence_transformers_document_embedder.schema";
import { schema as SentenceTransformersTextEmbedder } from "./sentence_transformers_text_embedder.schema";

export const schemas = [
  SentenceTransformersDocumentEmbedder,
  SentenceTransformersTextEmbedder,
];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/embedders"),
  title: "Embedders",
  schemas,
});
