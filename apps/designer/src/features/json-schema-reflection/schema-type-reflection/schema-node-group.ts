import type { TreeNodeOptions } from "@repo/shared/utils";
import { mixin } from "@repo/shared/utils";

import { schemaNode } from "./schema-node";
import { SchemaNodeTypes } from "./types";
import type { SchemaNodeGroup, SchemaNodeGroupData } from "./types";

export function schemaNodeGroup(
  options: TreeNodeOptions<SchemaNodeGroupData>,
): SchemaNodeGroup {
  const node = schemaNode(options);

  return mixin(node, {
    nodeType: SchemaNodeTypes.SchemaNodeGroup,

    get name(): string {
      return options.value.name;
    },
  });
}
