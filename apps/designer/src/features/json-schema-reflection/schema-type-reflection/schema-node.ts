import type { TreeNodeOptions } from "@repo/shared/utils";
import { ensureIsDefined, getId, mixin, treeNode } from "@repo/shared/utils";

import type { SchemaPropertyDescriptor } from "@/features/json-schema-reflection/types";

import { isSchemaNodeGroup } from "./type-utils";
import {
  SchemaNodeTypes,
  type SchemaNode,
  type SchemaNodeData,
  type SchemaNodeDescriptor,
  type SchemaNodeGroup,
} from "./types";

export function schemaNode<T extends SchemaNodeData = SchemaNodeData>(
  options: TreeNodeOptions<T>,
): SchemaNode<T> {
  const id = getId();
  const node = treeNode<T>(options);

  const nodeMixin: SchemaNode<T> = mixin(node, {
    id,
    nodeType: SchemaNodeTypes.SchemaNode,
    parent: node.parent as SchemaNode<T> | null,

    getGroup(name: string) {
      return node.children
        .filter(isSchemaNodeGroup)
        .find((gr) => gr.name === name);
    },

    getRequiredGroup(name: string) {
      return ensureIsDefined(this.getGroup(name));
    },

    addGroup(name: string) {
      const newGroup: SchemaNodeGroup = node.addChild({ type: "group", name });
      return newGroup;
    },

    addDescriptorNode(descriptor: SchemaPropertyDescriptor) {
      const newNode: SchemaNodeDescriptor = node.addChild({
        type: "descriptor",
        descriptor,
      });
      return newNode;
    },

    getChildren<NodeType extends SchemaNode>() {
      return node.children as NodeType[];
    },

    getRootNode() {
      return node.root as SchemaNodeDescriptor;
    },

    getRootSchema() {
      return this.getRootNode().schema;
    },

    buildNode() {
      return nodeMixin;
    },
  });

  return nodeMixin;
}
