import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/utils/device/component-device"),
  title: "ComponentDevice",
  description:
    "A representation of a device for a component. This can be either a single device or a device map.",
  __pyType: "ComponentDevice",
  __pyModule: "haystack.utils.device",
  __nodeType: "protocol",
  __defaultSchema: schemaId("/haystack/utils/device/component-device/single"),
};
