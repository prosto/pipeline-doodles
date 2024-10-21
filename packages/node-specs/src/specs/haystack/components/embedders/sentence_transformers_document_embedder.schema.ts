import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId(
    "/haystack/components/embedders/sentence_transformers_document_embedder",
  ),
  title: "SentenceTransformersDocumentEmbedder",
  description:
    "A component for computing Document embeddings using Sentence Transformers models.\n\nUsage example:\n```python\nfrom haystack import Document\nfrom haystack.components.embedders import SentenceTransformersDocumentEmbedder\ndoc = Document(content=\"I love pizza!\")\ndoc_embedder = SentenceTransformersDocumentEmbedder()\ndoc_embedder.warm_up()\n\nresult = doc_embedder.run([doc])\nprint(result['documents'][0].embedding)\n\n# [-0.07804739475250244, 0.1498992145061493, ...]\n```",
  type: "object",
  __pyType: "SentenceTransformersDocumentEmbedder",
  __pyModule:
    "haystack.components.embedders.sentence_transformers_document_embedder",
  __nodeType: "component",
  __defaultName: "doc-embedder",

  $defs: {
    initParameters: {
      type: "object",
      properties: {
        model: {
          type: "string",
          default: "sentence-transformers/all-mpnet-base-v2",
          __pyType: "str",
          description: "Local path or ID of the model on HuggingFace Hub.",
        },
        device: {
          $ref: "/haystack/utils/device/component-device",
          default: null,
          __pyType: "typing.Optional[haystack.utils.device.ComponentDevice]",
          description: "Overrides the default device used to load the model.",
        },
        token: {
          $ref: "/haystack/utils/auth/secret",
          default: {
            type: "env_var",
            env_vars: ["HF_API_TOKEN"],
            strict: false,
          },
          __pyType: "typing.Optional[haystack.utils.auth.Secret]",
          description:
            "The API token used to download private models from Hugging Face.",
        },
        prefix: {
          type: "string",
          default: "",
          __pyType: "str",
          description:
            "A string to add at the beginning of each text.\nCan be used to prepend the text with an instruction, as required by some embedding models,\nsuch as E5 and bge.",
        },
        suffix: {
          type: "string",
          default: "",
          __pyType: "str",
          description: "A string to add at the end of each text.",
        },
        batch_size: {
          type: "integer",
          default: 32,
          __pyType: "int",
          description: "Number of Documents to encode at once.",
        },
        progress_bar: {
          type: "boolean",
          default: true,
          __pyType: "bool",
          description: "If True shows a progress bar when running.",
        },
        normalize_embeddings: {
          type: "boolean",
          default: false,
          __pyType: "bool",
          description: "If True returned vectors will have length 1.",
        },
        meta_fields_to_embed: {
          type: "array",
          items: {
            type: "string",
          },
          default: null,
          __pyType: "typing.Optional[typing.List[str]]",
          description:
            "List of meta fields that will be embedded along with the Document text.",
        },
        embedding_separator: {
          type: "string",
          default: "\n",
          __pyType: "str",
          description:
            "Separator used to concatenate the meta fields to the Document text.",
        },
      },
      required: [
        "model",
        "prefix",
        "suffix",
        "batch_size",
        "progress_bar",
        "normalize_embeddings",
        "embedding_separator",
      ],
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
          description: "Documents to embed.",
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
