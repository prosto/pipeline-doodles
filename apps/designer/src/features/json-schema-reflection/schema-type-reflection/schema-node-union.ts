import type { JSONSchema } from "@repo/json-schema";
import { isJsonSchema, isPrimitiveJsonSchema } from "@repo/json-schema";
import type { TreeNodeOptions } from "@repo/shared/utils";
import { isDefined, mixin } from "@repo/shared/utils";

import { schemaDescriptorFactory } from "../schema-descriptor";

import { schemaNodeDescriptor } from "./schema-node-descriptor";
import { SchemaNodeTypes } from "./types";
import type {
  SchemaNodeUnion,
  SchemaNodeDescriptor,
  SchemaNodeDescriptorData,
  SchemaNodeProtocol,
} from "./types";

export function schemaNodeUnion(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeProtocol {
  const baseNode = schemaNodeDescriptor(options);
  const { schema: unionSchema } = baseNode;

  const unionNode: SchemaNodeUnion = mixin(baseNode, {
    nodeType: SchemaNodeTypes.SchemaNodeUnion,

    hasVariants: true,

    get variants() {
      return unionNode.getChildren<SchemaNodeDescriptor>();
    },

    async buildNode() {
      await reflectUnionTypes();

      reflectDefaultVariant();

      return unionNode;
    },
  });

  async function reflectUnionTypes(): Promise<void> {
    if (isJsonSchema(unionSchema) && isDefined(unionSchema.anyOf)) {
      await Promise.all(
        unionSchema.anyOf.map((anyOfSchema) =>
          unionNode
            .addDescriptorNode(
              schemaDescriptorFactory({
                schema: anyOfSchema as JSONSchema,
                parentSchema: unionSchema,
                isResolved: true,
              }),
            )
            .buildNode(),
        ),
      );
    }
  }

  function reflectDefaultVariant(): void {
    const [firstAvailable, ...remaining] = unionNode.allVariants();
    const firstPrimitive = remaining.find(({ schema }) =>
      isPrimitiveJsonSchema(schema),
    );

    Object.assign(unionNode, {
      defaultVariant: firstPrimitive ?? firstAvailable,
    });
  }

  return unionNode;
}
