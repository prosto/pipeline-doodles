import type { JSONSchema } from "@repo/json-schema/types";
import { schemaId } from "@repo/node-specs/schema";

export const pipelineParamsSchema: JSONSchema = {
  $id: schemaId("/haystack/component-parameters"),
  type: "object",
  properties: {
    max_runs_per_component: {
      type: "integer",
      minimum: 1,
      default: 100,
      description:
        "How many times the pipeline can run the same component before throwing an exception.",
    },

    metadata: {
      type: "object",
      additionalProperties: true,
      default: {},
      description:
        "Arbitrary dictionary to store metadata about this pipeline.\
           Make sure all the values contained in this dictionary can be serialized and deserialized if you wish to save this pipeline to file with `save_pipelines()/load_pipelines()`",
    },
  },
  required: ["max_runs_per_component"],
  additionalProperties: false,
};
