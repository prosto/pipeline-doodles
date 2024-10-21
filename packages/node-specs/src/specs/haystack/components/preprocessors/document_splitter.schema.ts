import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/preprocessors/document-splitter"),
  title: "DocumentSplitter",
  description:
    "Splits a list of text documents into a list of text documents with shorter texts.\n\nSplitting documents with long texts is a common preprocessing step during indexing.\nThis allows Embedders to create significant semantic representations\nand avoids exceeding the maximum context length of language models.",
  type: "object",
  __pyType: "DocumentSplitter",
  __pyModule: "haystack.components.preprocessors.document_splitter",
  __nodeType: "component",
  __defaultName: "splitter",
  $defs: {
    initParameters: {
      type: "object",
      properties: {
        split_by: {
          type: "string",
          enum: ["word", "sentence", "page", "passage"],
          default: "word",
          __pyType: "typing.Literal['word', 'sentence', 'page', 'passage']",
          description:
            'The unit by which the document should be split. Choose from "word" for splitting by " ",\n"sentence" for splitting by ".", "page" for splitting by "\\f" or "passage" for splitting by "\\n\\n".',
        },
        split_length: {
          type: "integer",
          default: 200,
          __pyType: "int",
          description: "The maximum number of units in each split.",
        },
        split_overlap: {
          type: "integer",
          default: 0,
          __pyType: "int",
          description: "The number of units that each split should overlap.",
        },
      },
      required: ["split_by", "split_length", "split_overlap"],
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
          description: "The documents to split.",
        },
      },
      required: ["documents"],
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
