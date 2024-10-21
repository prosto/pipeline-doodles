import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId(
    "/haystack/components/embedders/sentence_transformers_text_embedder",
  ),
  title: "SentenceTransformersTextEmbedder",
  description:
    "A component for embedding strings using Sentence Transformers models.",
  type: "object",
  __pyType: "SentenceTransformersTextEmbedder",
  __pyModule:
    "haystack.components.embedders.sentence_transformers_text_embedder",
  __nodeType: "component",
  __defaultName: "text-embedder",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        model: {
          type: "string",
          __pyType: "str",
          default: "sentence-transformers/all-mpnet-base-v2",
          description:
            "Local path or name of the model in Hugging Face's model hub",
        },
        device: {
          type: "string",
          __pyType: "Optional[str]",
          description:
            "The device on which the model is loaded. If `None`, the default device is automatically selected.",
        },
        token: {
          type: "string",
          __pyType: "Optional[str]",
          description:
            "The API token used to download private models from Hugging Face.",
        },
        prefix: {
          type: "string",
          __pyType: "str",
          default: "",
          description:
            "A string to add to the beginning of each Document text before embedding. Can be used to prepend the text with an instruction, as required by some embedding models, such as E5 and bge.",
        },
        suffix: {
          type: "string",
          __pyType: "str",
          default: "",
          description: "A string to add to the end of each text.",
        },
        batch_size: {
          type: "integer",
          __pyType: "int",
          default: 32,
          description: "Number of strings to encode at once.",
        },
        progress_bar: {
          type: "boolean",
          __pyType: "bool",
          default: true,
          description: "If true, displays progress bar during embedding.",
        },
        normalize_embeddings: {
          type: "boolean",
          __pyType: "bool",
          default: false,
          description: "If set to true, returned vectors will have length 1.",
        },
      },
      required: [
        "model",
        "prefix",
        "suffix",
        "batch_size",
        "progress_bar",
        "normalize_embeddings",
      ],
      additionalProperties: false,
    },
    inputTypes: {
      type: "object",
      properties: {
        text: {
          type: "string",
          __pyType: "str",
          description: "Text to embed.",
        },
      },
      required: ["text"],
      additionalProperties: false,
    },
    outputTypes: {
      type: "object",
      properties: {
        embedding: {
          type: "array",
          __pyType: "List[ByteStream]",
          items: {
            type: "number",
            format: "float",
          },
          description: "Embedding for the given text.",
        },
      },
      required: ["embedding"],
      additionalProperties: false,
    },
  },
};
