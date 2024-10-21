import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/writers/DocumentWriter"),
  title: "DocumentWriter",
  description:
    'Writes documents to a DocumentStore.\n\nUsage example:\n```python\nfrom haystack import Document\nfrom haystack.components.writers import DocumentWriter\nfrom haystack.document_stores.in_memory import InMemoryDocumentStore\ndocs = [\n    Document(content="Python is a popular programming language"),\n]\ndoc_store = InMemoryDocumentStore()\ndoc_store.write_documents(docs)\n```',
  type: "object",
  __pyType: "DocumentWriter",
  __pyModule: "haystack.components.writers.document_writer",
  __nodeType: "component",
  __defaultName: "writer",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        document_store: {
          $ref: "/haystack/document-stores/document-store",
          description:
            "The DocumentStore where the documents are to be written.",
        },
        policy: {
          title: "DuplicatePolicy",
          type: "string",
          enum: ["none", "skip", "overwrite", "fail"],
          default: "none",
          __pyType: "haystack.document_stores.types.policy.DuplicatePolicy",
          description:
            "The policy to apply when a Document with the same id already exists in the DocumentStore.\n- `DuplicatePolicy.NONE`: Default policy, behavior depends on the Document Store.\n- `DuplicatePolicy.SKIP`: If a Document with the same id already exists, it is skipped and not written.\n- `DuplicatePolicy.OVERWRITE`: If a Document with the same id already exists, it is overwritten.\n- `DuplicatePolicy.FAIL`: If a Document with the same id already exists, an error is raised.",
        },
      },
      required: ["document_store", "policy"],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        documents: {
          type: "array",
          items: {
            $ref: "/haystack/dataclasses/document",
          },
          __pyType: "typing.List[haystack.dataclasses.document.Document]",
          description: "A list of documents to write to the store.",
        },
        policy: {
          title: "DuplicatePolicy",
          type: "string",
          enum: ["none", "skip", "overwrite", "fail"],
          nullable: true,
          default: null,
          __pyType:
            "typing.Optional[haystack.document_stores.types.policy.DuplicatePolicy]",
          description:
            "The policy to use when encountering duplicate documents.",
        },
      },
      required: ["documents"],
      additionalProperties: false,
    },
    outputTypes: {
      type: "object",
      properties: {
        documents_written: {
          type: "integer",
          __pyType: "int",
        },
      },
      required: ["documents_written"],
      additionalProperties: false,
    },
  },
};
