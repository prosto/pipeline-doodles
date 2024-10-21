import type { JSONSchema } from "@repo/json-schema/types";
import type { NodeJsonSchema } from "@repo/node-specs/types";
import { getId } from "@repo/shared/utils";

import type { SchemaPropertyDescriptor } from "./types";

interface SchemaDescriptorFactory {
  id?: string;
  name?: string;
  schema: JSONSchema;
  refPath?: string;
  parentSchema?: JSONSchema;
  isResolved?: boolean;
  isOptional?: boolean;
  isAdditional?: boolean;
}

export function schemaDescriptorFactory({
  id = getId(),
  name,
  schema,
  refPath = "#",
  parentSchema,
  isResolved = false,
  isOptional = false,
  isAdditional = false,
}: SchemaDescriptorFactory): SchemaPropertyDescriptor {
  const exSchema = schema as NodeJsonSchema;
  const { title, description, default: defaultValue } = exSchema;

  return {
    id,
    name,

    parentSchema,
    schema,
    refPath,

    isResolved,
    isOptional,
    isAdditional,

    pyType: exSchema.__pyType,
    get pyTypeSimple() {
      return exSchema.__pyType?.replaceAll(/[^[ ]+\./g, "");
    },

    title,
    description,
    defaultValue,
  };
}
