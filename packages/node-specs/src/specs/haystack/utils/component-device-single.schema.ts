import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/utils/device/component-device/single"),
  title: "SingleDevice",
  description: "A representation of a single device for a component.",
  __baseSchemaId: schemaId("/haystack/utils/device/component-device"),
  __pyType: "ComponentDevice",
  __pyModule: "haystack.utils.device",
  __nodeType: "data",

  type: "object",
  properties: {
    type: {
      const: "single",
      __pyType: "str",
    },
    device: {
      type: "string",
      pattern: "(cpu|cuda|disk|mps)(:\\d+)?",
      __pyType: "str",
      description:
        "The device type with optional device id in the following format <cpu|cuda|disk|mps>:<id>.",
    },
  },
  required: ["type", "device"],
  additionalProperties: false,
};
