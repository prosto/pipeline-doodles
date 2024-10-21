import type { NodeJsonSchema } from "@repo/node-specs/types";
import type { TreeNodeOptions } from "@repo/shared/utils";
import { mixin } from "@repo/shared/utils";

import { schemaNodeDescriptor } from "./schema-node-descriptor";
import { type SchemaNodeBundle, type SchemaNodeDescriptorData } from "./types";

export function schemaNodeBundle(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeBundle {
  const node = schemaNodeDescriptor(options);

  const bundleNode: SchemaNodeBundle = mixin(node, {
    schema: node.schema as NodeJsonSchema,
  });

  return bundleNode;
}
