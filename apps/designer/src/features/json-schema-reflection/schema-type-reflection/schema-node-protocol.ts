import { isPrimitiveJsonSchema } from "@repo/json-schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";
import type { TreeNodeOptions } from "@repo/shared/utils";
import { mixin } from "@repo/shared/utils";

import { schemaDescriptorFactory } from "../schema-descriptor";

import { reflectionContext } from "./reflection-context";
import { schemaNodeDescriptor } from "./schema-node-descriptor";
import { SchemaNodeTypes } from "./types";
import type {
  SchemaNodeDescriptor,
  SchemaNodeDescriptorData,
  SchemaNodeProtocol,
} from "./types";

export function schemaNodeProtocol(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeProtocol {
  const {
    schemaRepository: { findSchemas, dereferenceSchema },
  } = reflectionContext.useX();

  const baseNode = schemaNodeDescriptor(options);
  const { schema: protocolSchema } = baseNode;

  const protocolNode: SchemaNodeProtocol = mixin(baseNode, {
    nodeType: SchemaNodeTypes.SchemaNodeProtocol,
    hasVariants: true,

    get variants() {
      return protocolNode.getChildren<SchemaNodeDescriptor>();
    },

    async buildNode() {
      await reflectVariants();

      reflectDefaultVariant();

      return protocolNode;
    },
  });

  async function reflectVariants(): Promise<void> {
    const matchingSchemas = findSchemas({
      __baseSchemaId: baseNode.schemaId,
    });

    const resolvedSchemas = await Promise.all(
      matchingSchemas.map((schema) =>
        dereferenceSchema({
          schema,
        }),
      ),
    );

    await Promise.all(
      resolvedSchemas.map(({ schema: variantSchema }) =>
        protocolNode
          .addDescriptorNode(
            schemaDescriptorFactory({
              schema: variantSchema,
              parentSchema: protocolSchema,
              isResolved: true,
            }),
          )
          .buildNode(),
      ),
    );
  }

  function findDefaultVariant(): SchemaNodeDescriptor {
    const [firstAvailable, ...remaining] = protocolNode.allVariants();
    const firstPrimitive = remaining.find(({ schema }) =>
      isPrimitiveJsonSchema(schema),
    );

    return firstPrimitive ?? firstAvailable;
  }

  function reflectDefaultVariant(): void {
    const defaultSchemaId = (protocolSchema as NodeJsonSchema).__defaultSchema;

    const defaultVariant = protocolNode.variants.find(
      ({ schemaId }) => schemaId === defaultSchemaId,
    );

    Object.assign(protocolNode, {
      defaultVariant: defaultVariant ?? findDefaultVariant(),
    });
  }

  return protocolNode;
}
