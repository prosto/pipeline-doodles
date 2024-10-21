import { defaults, pick } from "lodash-es";

import type { SchemaNode } from "./types";

export function schemaNodeWithParentDefaults<T extends SchemaNode>({
  node,
  fallbackTo,
}: {
  node: T;
  fallbackTo: (keyof SchemaNode)[];
}): T {
  const baseNode = node.parent;
  return defaults(node, pick(baseNode, ...fallbackTo));
}
