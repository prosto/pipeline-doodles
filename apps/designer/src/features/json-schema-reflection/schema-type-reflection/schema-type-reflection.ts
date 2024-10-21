import type { JSONSchema } from "@repo/json-schema";
import { cloneDeep } from "lodash-es";

import { schemaDescriptorFactory } from "../schema-descriptor";
import { schemaRepositoryFactory } from "../schema-repository";

import { loadExtraProperties } from "./schema-extra-nodes";
import { schemaNodeFactory } from "./schema-node-factory";
import type { SchemaTypeReflection, SchemaNodeDescriptor } from "./types";

export function schemaTypeReflectionFactory(): SchemaTypeReflection {
  const schemaRepository = schemaRepositoryFactory();

  return {
    async buildReflectionTree(
      schema: JSONSchema | string,
      refPath = "#",
    ): Promise<SchemaNodeDescriptor> {
      const { schema: dereferencedSchema, $refs } =
        await schemaRepository.dereferenceSchema({
          schema,
          refPath,
        });

      const schemaClone = cloneDeep(dereferencedSchema);

      const createNode = schemaNodeFactory({
        schemaRepository,
        schema: schemaClone,
        $refs,
      });

      await loadExtraProperties(createNode);

      const rootNode = await createNode({
        descriptor: schemaDescriptorFactory({
          schema: schemaClone,
          isResolved: true,
        }),
        type: "descriptor",
      }).buildNode();

      return rootNode as SchemaNodeDescriptor;
    },
  };
}
