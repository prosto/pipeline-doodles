import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/joiners/document_joiner"),
  title: "DocumentJoiner",
  description: "Joins multiple lists of documents into a single list.",
  type: "object",
  __pyType: "DocumentJoiner",
  __pyModule: "haystack.components.joiners",
  __nodeType: "component",
  __defaultName: "document-joiner",

  $defs: {
    initParameters: {
      $id: schemaId("/haystack/components/joiners/document_joiner/init"),
      type: "object",
      properties: {
        join_mode: {
          type: "string",
          default: "concatenate",
          __pyType: "str",
          description: "Specifies the join mode to use.",
        },
        sort_by_score: {
          type: "boolean",
          default: true,
          __pyType: "bool",
          description:
            "If `True`, sorts the documents by score in descending order.\
            If a document has no score, it is handled as if its score is -infinity.",
        },
      },
      required: ["join_mode", "sort_by_score"],
      additionalProperties: false,
    },
    inputTypes: {
      $id: schemaId("/haystack/components/preprocessors/document_joiner/input"),
      type: "object",
      properties: {
        documents: {
          type: "array",
          variadic: true,
          items: {
            type: "array",
            title: "DocumentList",
            items: {
              $ref: "/haystack/dataclasses/document",
            },
          },
          __pyType:
            "haystack.core.component.types.Variadic[typing.List[haystack.dataclasses.document.Document]]",
          description: "List of list of documents to be merged.",
        },

        top_k: {
          type: "integer",
          __pyType: "int",
          description:
            "The maximum number of documents to return. Overrides the instance's `top_k` if provided.",
        },
      },
      required: ["documents"],
      additionalProperties: false,
    },
    outputTypes: {
      $id: schemaId(
        "/haystack/components/preprocessors/document-cleaner/output",
      ),
      type: "object",
      properties: {
        documents: {
          type: "array",
          items: {
            $ref: "/haystack/dataclasses/document",
          },
          __pyType: "typing.List[haystack.dataclasses.document.Document]",
          description: "Merged list of Documents",
        },
      },
      required: ["documents"],
      additionalProperties: false,
    },
  },
};
