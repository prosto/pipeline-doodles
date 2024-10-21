import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/components/preprocessors/document-cleaner"),
  title: "DocumentCleaner",
  description:
    'Cleans up text documents by removing extra whitespaces, empty lines, specified substrings, regexes,\npage headers and footers (in this order).\n\nUsage example:\n```python\nfrom haystack import Document\nfrom haystack.components.preprocessors import DocumentCleaner\n\ndoc = Document(content="This   is  a  document  to  clean\\n\\n\\nsubstring to remove")\n\ncleaner = DocumentCleaner(remove_substrings = ["substring to remove"])\nresult = cleaner.run(documents=[doc])\n\nassert result["documents"][0].content == "This is a document to clean "\n```',
  type: "object",
  __pyType: "DocumentCleaner",
  __pyModule: "haystack.components.preprocessors.document_cleaner",
  __nodeType: "component",
  __defaultName: "cleaner",
  $defs: {
    initParameters: {
      $id: schemaId("/haystack/components/preprocessors/document-cleaner/init"),
      type: "object",
      properties: {
        remove_empty_lines: {
          type: "boolean",
          default: true,
          __pyType: "bool",
          description: "Whether to remove empty lines.",
        },
        remove_extra_whitespaces: {
          type: "boolean",
          default: true,
          __pyType: "bool",
          description: "Whether to remove extra whitespaces.",
        },
        remove_repeated_substrings: {
          type: "boolean",
          default: false,
          __pyType: "bool",
          description:
            'Whether to remove repeated substrings (headers/footers) from pages.\nPages in the text need to be separated by form feed character "\\f",\nwhich is supported by `TextFileToDocument` and `AzureOCRDocumentConverter`.',
        },
        remove_substrings: {
          type: "array",
          items: {
            type: "string",
          },
          nullable: true,
          default: null,
          __pyType: "typing.Optional[typing.List[str]]",
          description: "List of substrings to remove from the text.",
        },
        remove_regex: {
          type: "string",
          nullable: true,
          default: null,
          __pyType: "typing.Optional[str]",
          description: 'Regex to match and replace substrings by "".',
        },
      },
      required: [
        "remove_empty_lines",
        "remove_extra_whitespaces",
        "remove_repeated_substrings",
      ],
      additionalProperties: false,
    },
    inputTypes: {
      $id: schemaId(
        "/haystack/components/preprocessors/document-cleaner/input",
      ),
      type: "object",
      properties: {
        documents: {
          type: "array",
          items: {
            $ref: "/haystack/dataclasses/document",
          },
          __pyType: "typing.List[haystack.dataclasses.document.Document]",
          description: "List of Documents to clean.",
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
        },
      },
      required: ["documents"],
      additionalProperties: false,
    },
  },
};
