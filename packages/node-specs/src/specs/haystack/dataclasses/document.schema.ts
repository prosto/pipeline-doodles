import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/dataclasses/document"),
  title: "Document",
  description:
    "Base data class containing some data to be queried. Can contain text snippets, tables, and file paths to images or audios.",
  __pyType: "Document",
  __pyModule: "haystack.dataclasses",
  __nodeType: "data",

  type: "object",
  required: ["id"],
  additionalProperties: false,
  properties: {
    id: {
      type: "string",
      __pyType: "str",
      description:
        "Unique identifier for the document. When not set, it's generated based on the Document fields' values.",
      default: "",
    },
    content: {
      type: "string",
      format: "long-string",
      __pyType: "Optional[str]",
      default: "bla",
      description: "Text of the document, if the document contains text.",
    },
    score: {
      type: "number",
      format: "float",
      __pyType: "Optional[float]",
      description:
        "Score of the document. Used for ranking, usually assigned by retrievers.",
    },
    embedding: {
      type: "array",
      items: {
        type: "number",
        format: "float",
      },
      __pyType: "Optional[List[float]]",
      description: "Vector representation of the document.",
      options: {
        format: "multiline-string",
      },
    },
    dataframe: {
      type: "object",
      __pyType: "DataFrame",
      __pyModule: "pandas",
      required: [],
      description:
        "Pandas dataframe with the document's content, if the document contains tabular data.",
    },
    blob: {
      $ref: "/haystack/dataclasses/byte-stream",
      __pyType: "Optional[ByteStream]",
      description:
        "Binary data associated with the document, if the document has any binary data associated with it.",
    },
    meta: {
      type: "object",
      __pyType: "Dict[str, Any]",
      additionalProperties: true,
      required: [],
      description:
        "Additional custom metadata for the document. Must be JSON-serializable.",
    },
  },
};
