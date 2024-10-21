import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as InMemoryBM25Retriever } from "./bm25_retriever.schema";
import { schema as InMemoryEmbeddingRetriever } from "./embedding_retriever.schema";

export const schemas = [InMemoryBM25Retriever, InMemoryEmbeddingRetriever];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/retrievers"),
  title: "Retrievers",
  schemas,
});
