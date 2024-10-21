import { changeSchemaId, isPrimitiveJsonSchema } from "@repo/json-schema";
import type { TreeNodeOptions } from "@repo/shared/utils";
import { mixin } from "@repo/shared/utils";

import { schemaNode } from "./schema-node";
import { isSchemaNodeBundle } from "./type-utils";
import type { SchemaNodeDescriptor, SchemaNodeDescriptorData } from "./types";

export function schemaNodeDescriptor(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeDescriptor {
  const node = schemaNode(options);
  const { parent: parentNode } = options;

  const {
    value: { descriptor },
  } = node;

  const {
    schema,
    parentSchema,
    title,
    description,
    name: propertyName,
    isOptional,
    defaultValue,
  } = descriptor;

  const schemaId = schema.$id;
  const dynamicSchemaId = schemaId
    ? `${schemaId}/${node.id}`
    : `${node.getRootSchema().$id}/${node.id}`;

  // We will change id for each sub-schema to avoid conflicts during schema validation
  // new $id will guarantee schema can be compiled and cached (by its unique id) without affecting
  // same schemas used in other components
  if (!node.isRoot()) {
    changeSchemaId(schema, dynamicSchemaId);
  }

  // In most cases a variant is identified by its node id, but for bundle nodes (e.g. components)
  // variant id should point to its parent node
  const variantId =
    parentNode && isSchemaNodeBundle(parentNode) ? parentNode.id : node.id;

  return mixin(node, {
    descriptor,
    schema,
    schemaId,
    dynamicSchemaId,
    propertyName,
    isOptional,
    defaultValue,

    title,
    description,

    schemaType: schema.type,
    parentSchemaType: parentSchema?.type,

    get variadic() {
      return Boolean(schema.variadic);
    },

    isPrimitive: isPrimitiveJsonSchema(schema),
    hasVariants: false,
    variants: [],
    variantId,

    *allVariants() {
      const childrenWithVariants: SchemaNodeDescriptor[] = [...this.variants];

      while (childrenWithVariants.length) {
        const childNode = childrenWithVariants.pop();

        if (childNode) {
          yield childNode;

          childrenWithVariants.push(...childNode.variants);
        }
      }
    },
  });
}
