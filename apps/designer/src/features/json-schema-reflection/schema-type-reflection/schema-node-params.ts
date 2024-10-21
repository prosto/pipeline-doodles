import type { TreeNodeOptions } from "@repo/shared/utils";
import { ensureIsDefined, mixin } from "@repo/shared/utils";

import { schemaNodeObject } from "./schema-node-object";
import type {
  SchemaNodeBundle,
  SchemaNodeDescriptorData,
  SchemaNodeParamsObject,
} from "./types";

interface SchemaNodeParamsOptions
  extends TreeNodeOptions<SchemaNodeDescriptorData> {
  paramsType: "init" | "input" | "output";
}

export function schemaNodeParams(
  options: SchemaNodeParamsOptions,
): SchemaNodeParamsObject {
  const node = schemaNodeObject(options);
  const parent = ensureIsDefined(node.parent as SchemaNodeBundle);

  return mixin(node, {
    parent,
    paramsType: options.paramsType,

    title: node.title ?? parent.title,
    description: node.description ?? parent.description,
  });
}
