import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/document-stores/in-memory"),
  title: "InMemoryDocumentStore",
  description:
    "Stores data in-memory. It's ephemeral and cannot be saved to disk.",
  __baseSchemaId: schemaId("/haystack/document-stores/document-store"),
  __pyType: "InMemoryDocumentStore",
  __pyModule: "haystack.document_stores.in_memory.document_store",
  __nodeType: "document-store",
  __defaultName: "doc-store",
  $defs: {
    initParameters: {
      type: "object",
      properties: {
        bm25_tokenization_regex: {
          type: "string",
          description:
            "The regular expression used to tokenize the text for BM25 retrieval.",
          default: "(?u)\\\\b\\\\w\\\\w+\\\\b",
        },
        bm25_algorithm: {
          type: "string",
          enum: ["BM25Okapi", "BM25L", "BM25Plus"],
          __pyType: 'Literal["BM25Okapi", "BM25L", "BM25Plus"]',
          default: "BM25L",
          description:
            'The BM25 algorithm to use. One of "BM25Okapi", "BM25L", or "BM25Plus".',
        },
        bm25_parameters: {
          description:
            "Parameters for BM25 implementation in a dictionary format. You can learn more about these parameters by visiting https://github.com/dorianbrown/rank_bm25.",
          type: "object",
          additionalProperties: true,
          required: [],
        },
        embedding_similarity_function: {
          type: "string",
          description:
            "Age in years which must be equal to or greater than zero.",
          enum: ["dot_product", "cosine"],
          default: "dot_product",
        },
      },
      required: [
        "bm25_tokenization_regex",
        "bm25_algorithm",
        "embedding_similarity_function",
      ],
      additionalProperties: false,
    },
  },
};
