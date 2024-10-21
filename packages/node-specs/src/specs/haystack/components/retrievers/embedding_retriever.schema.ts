import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId(
    "/haystack/components/retrievers/in-memory-embedding-retriever",
  ),
  title: "InMemoryEmbeddingRetriever",
  description:
    'Retrieves documents using vector similarity.\n\nUsage example:\n```python\nfrom haystack import Document\nfrom haystack.components.embedders import SentenceTransformersDocumentEmbedder, SentenceTransformersTextEmbedder\nfrom haystack.components.retrievers.in_memory import InMemoryEmbeddingRetriever\nfrom haystack.document_stores.in_memory import InMemoryDocumentStore\n\ndocs = [\n    Document(content="Python is a popular programming language"),\n    Document(content="python ist eine beliebte Programmiersprache"),\n]\ndoc_embedder = SentenceTransformersDocumentEmbedder()\ndoc_embedder.warm_up()\ndocs_with_embeddings = doc_embedder.run(docs)["documents"]\n\ndoc_store = InMemoryDocumentStore()\ndoc_store.write_documents(docs_with_embeddings)\nretriever = InMemoryEmbeddingRetriever(doc_store)\n\nquery="Programmiersprache"\ntext_embedder = SentenceTransformersTextEmbedder()\ntext_embedder.warm_up()\nquery_embedding = text_embedder.run(query)["embedding"]\n\nresult = retriever.run(query_embedding=query_embedding)\n\nprint(result["documents"])\n```',
  type: "object",
  __pyType: "InMemoryEmbeddingRetriever",
  __pyModule: "haystack.components.retrievers.in_memory.embedding_retriever",
  __nodeType: "component",
  __defaultName: "retriever",
  $defs: {
    initParameters: {
      type: "object",
      properties: {
        document_store: {
          $ref: "/haystack/document-stores/in-memory",
          description: "An instance of InMemoryDocumentStore.",
        },
        filters: {
          type: "object",
          additionalProperties: true,
          default: null,
          __pyType: "typing.Optional[typing.Dict[str, typing.Any]]",
          description:
            "A dictionary with filters to narrow down the search space.",
        },
        top_k: {
          type: "integer",
          default: 10,
          __pyType: "int",
          description: "The maximum number of documents to retrieve.",
        },
        scale_score: {
          type: "boolean",
          default: false,
          __pyType: "bool",
          description:
            "Scales the BM25 score to a unit interval in the range of 0 to 1, where 1 means extremely relevant. If set to `False`, uses raw similarity scores.",
        },
        return_embedding: {
          type: "boolean",
          default: false,
          __pyType: "bool",
          description:
            "Whether to return the embedding of the retrieved Documents.",
        },
      },
      required: ["document_store", "top_k", "scale_score", "return_embedding"],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        query_embedding: {
          type: "array",
          items: {
            type: "number",
          },
          __pyType: "typing.List[float]",
          description: "Embedding of the query.",
        },
        filters: {
          type: "object",
          additionalProperties: true,
          default: null,
          __pyType: "typing.Optional[typing.Dict[str, typing.Any]]",
          description:
            "A dictionary with filters to narrow down the search space.",
        },
        top_k: {
          type: "integer",
          default: null,
          __pyType: "typing.Optional[int]",
          description: "The maximum number of documents to return.",
        },
        scale_score: {
          type: "boolean",
          default: null,
          __pyType: "typing.Optional[bool]",
          description:
            "Scales the similarity score to a unit interval in the range of 0 to 1, where 1 means extremely relevant. If set to `False`, uses raw similarity scores.\nIf not specified, the value provided at initialization is used.",
        },
        return_embedding: {
          type: "boolean",
          default: null,
          __pyType: "typing.Optional[bool]",
          description:
            "Whether to return the embedding of the retrieved Documents.",
        },
      },
      required: ["query_embedding"],
      additionalProperties: false,
    },
    outputTypes: {
      type: "object",
      properties: {
        documents: {
          type: "array",
          items: {
            $ref: "/haystack/dataclasses/document",
          },
          __pyType: "typing.List[haystack.dataclasses.document.Document]",
        },
      },
      required: ["documents"],
      additionalProperties: false,
    },
  },
};
