import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/dataclasses/byte-stream"),
  title: "ByteStream",
  description:
    "Base data class representing a binary object in the Haystack API.",
  __pyType: "ByteStream",
  __pyModule: "haystack.dataclasses",
  __nodeType: "data",

  type: "object",
  properties: {
    data: {
      type: "string",
      __pyType: "bytes",
      format: "byte",
      description: "base64 encoded characters",
    },
    mime_type: {
      type: "string",
      __pyType: "Optional[str]",
      description: "The mime type",
    },
    meta: {
      type: "object",
      __pyType: "Dict[str, Any]",
      description: "Additional metadata to be stored with the ByteStream",
      additionalProperties: true,
      default: {},
      required: [],
    },
  },
  required: ["data", "meta"],
  additionalProperties: false,
};
