import type { JSONSchema } from "@repo/json-schema";

import { schemaId } from "@repo/node-specs/schema";

export const schema: JSONSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/utils/device/device-types"),
  title: "ComponentDeviceTypes",
  description: "Type definitions for component devices",

  $defs: {
    deviceType: {
      $id: schemaId("/haystack/utils/device/device-type"),
      title: "DeviceType",
      description:
        "Represents device types supported by Haystack.\
        This also includes devices that are not directly used by models - for example, the disk device is exclusively used \
        in device maps for frameworks that support offloading model weights to disk.",
      __pyType: "Device",
      __pyModule: "haystack.utils.device",
      type: "string",
      enum: ["cpu", "cuda", "disk", "mps"],
    },

    device: {
      $id: schemaId("/haystack/utils/device/device"),
      title: "Device",
      description: "A generic representation of a device.",
      __pyType: "Device",
      __pyModule: "haystack.utils.device",

      type: "object",
      properties: {
        type: {
          $ref: schemaId("/haystack/utils/device/device-type"),
        },

        id: {
          type: "integer",
          __pyType: "Optional[int]",
          description: "The optional device id.",
          nullable: true,
          default: null,
        },
      },
      required: ["type"],
      additionalProperties: false,
    },

    deviceMap: {
      $id: schemaId("/haystack/utils/device/device-map"),
      title: "DeviceMap",
      description:
        "A generic mapping from strings to devices.\
        The semantics of the strings are dependent on target framework. Primarily used to deploy HuggingFace models to \
        multiple devices.",
      __pyType: "DeviceMap",
      __pyModule: "haystack.utils.device",

      type: "object",
      additionalProperties: {
        $ref: schemaId("/haystack/utils/device/device"),
      },
    },
  },
};
