import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/retrievers/bm25_retriever"),
  title: "InMemoryBM25Retriever",
  description:
    'Retrieves documents that are most similar to the query using keyword-based algorithm.\n\nUse this retriever with the InMemoryDocumentStore.\n\n### Usage example\n\n```python\nfrom haystack import Document\nfrom haystack.components.retrievers.in_memory import InMemoryBM25Retriever\nfrom haystack.document_stores.in_memory import InMemoryDocumentStore\n\ndocs = [\n    Document(content="Python is a popular programming language"),\n    Document(content="python ist eine beliebte Programmiersprache"),\n]\n\ndoc_store = InMemoryDocumentStore()\ndoc_store.write_documents(docs)\nretriever = InMemoryBM25Retriever(doc_store)\n\nresult = retriever.run(query="Programmiersprache")\n\nprint(result["documents"])\n```',
  type: "object",
  __pyType: "InMemoryBM25Retriever",
  __pyModule: "haystack.components.retrievers.in_memory.bm25_retriever",
  __nodeType: "component",
  __defaultName: "bm25-retriever",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        document_store: {
          $ref: "/haystack/document-stores/in-memory",
          description:
            "An instance of InMemoryDocumentStore where the retriever should search for relevant documents.",
        },
        filters: {
          type: "object",
          additionalProperties: true,
          default: null,
          __pyType: "typing.Optional[typing.Dict[str, typing.Any]]",
          description:
            "A dictionary with filters to narrow down the retriever's search space in the document store.",
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
            "When `True`, scales the score of retrieved documents to a range of 0 to 1, where 1 means extremely relevant.\nWhen `False`, uses raw similarity scores.",
        },
        filter_policy: {
          title: "FilterPolicy",
          type: "string",
          enum: ["replace", "merge"],
          default: "replace",
          __pyType: "haystack.document_stores.types.filter_policy.FilterPolicy",
          description:
            "The filter policy to apply during retrieval.\nFilter policy determines how filters are applied when retrieving documents. You can choose:\n- `REPLACE` (default): Overrides the initialization filters with the filters specified at runtime.\nUse this policy to dynamically change filtering for specific queries.\n- `MERGE`: Combines runtime filters with initialization filters to narrow down the search.",
        },
      },
      required: ["document_store", "top_k", "scale_score", "filter_policy"],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        query: {
          type: "string",
          __pyType: "str",
          description: "The query string for the Retriever.",
        },
        filters: {
          type: "object",
          additionalProperties: true,
          default: null,
          __pyType: "typing.Optional[typing.Dict[str, typing.Any]]",
          description:
            "A dictionary with filters to narrow down the search space when retrieving documents.",
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
            "When `True`, scales the score of retrieved documents to a range of 0 to 1, where 1 means extremely relevant.\nWhen `False`, uses raw similarity scores.",
        },
      },
      required: ["query"],
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
