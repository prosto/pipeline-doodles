import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/dataclasses/streaming-chunk"),
  title: "StreamingChunk",
  description:
    "The StreamingChunk class encapsulates a segment of streamed content along with associated metadata. This structure facilitates the handling and processing of streamed data in a systematic manner.",
  type: "object",
  __pyType: "StreamingChunk",
  __pyModule: "haystack.dataclasses",
  __nodeType: "data",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
          __pyType: "str",
          description: "The content of the message chunk as a string.",
        },
        meta: {
          type: "object",
          __pyType: "Dict[str, Any]",
          additionalProperties: true,
          required: [],
          description:
            "A dictionary containing metadata related to the message chunk.",
        },
      },
      required: ["content"],
      additionalProperties: false,
    },
  },
};
