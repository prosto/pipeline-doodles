import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/dataclasses/chat-message"),
  title: "ChatMessage",
  description: "Represents a message in a LLM chat conversation.",
  __pyType: "ChatMessage",
  __pyModule: "haystack.dataclasses",
  __nodeType: "data",

  type: "object",
  properties: {
    role: {
      enum: ["assistant", "user", "system", "function"],
      type: "string",

      __pyType: "str",
      description: "The role of the entity sending the message.",
    },
    content: {
      type: "string",
      format: "long-string",
      __pyType: "str",
      description: "The text content of the message.",
    },
    name: {
      type: "string",
      __pyType: "str",
      description:
        "The name of the function being called (only applicable for role FUNCTION).",
    },
    meta: {
      type: "object",
      __pyType: "Dict[str, Any]",
      additionalProperties: true,
      required: [],
      default: {},
      description: "Additional metadata associated with the message.",
    },
  },
  required: ["content", "role"],
  additionalProperties: false,
};
