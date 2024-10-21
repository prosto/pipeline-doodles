import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/utils/device/component-device/multiple"),
  title: "MultipleDevices",
  description: "A representation of multiple devices for a component.",
  __baseSchemaId: schemaId("/haystack/utils/device/component-device"),
  __pyType: "ComponentDevice",
  __pyModule: "haystack.utils.device",
  __nodeType: "data",

  type: "object",
  properties: {
    type: {
      const: "multiple",
      __pyType: "str",
    },
    device_map: {
      type: "object",
      additionalProperties: {
        type: "string",
        pattern: "(cpu|cuda|disk|mps)(:\\\\d+)?",
        __pyType: "str",
      },
    },
  },
  required: ["type", "device_map"],
  additionalProperties: false,
};
