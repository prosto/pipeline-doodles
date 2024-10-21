import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";

export const schema: NodeJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: schemaId("/haystack/utils/auth/env-var-secret"),
  title: "EnvVarSecret",
  description:
    "A secret that accepts one or more environment variables. Upon resolution, it returns a string token from the first environment variable that is set.",
  __baseSchemaId: schemaId("/haystack/utils/auth/secret"),
  __pyType: "EnvVarSecret",
  __pyModule: "haystack.utils.auth",
  __nodeType: "data",

  type: "object",
  properties: {
    type: {
      const: "env_var",
    },
    strict: {
      type: "boolean",
      __pyType: "bool",
      description:
        "Strict environment variable resolution - makes sure variable is present/set otherwise raises exception.",
      default: true,
    },
    env_vars: {
      type: "array",
      items: {
        type: "string",
      },
      __pyType: "typing.Tuple[str, ...]",
      description: "List of environment variable names.",
    },
  },
  required: ["type", "env_vars", "strict"],
  additionalProperties: false,
};
