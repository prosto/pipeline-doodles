import type { JSONSchema } from "@repo/json-schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";
import { isDefined, type TreeNode } from "@repo/shared/utils";

import { SchemaNodeTypes } from "./types";
import type {
  SchemaNodeArray,
  SchemaNodeBundle,
  SchemaNodeDescriptor,
  SchemaNodeGroup,
  SchemaNodeParamsObject,
} from "./types";

export function isSchemaNodeGroup(node: TreeNode): node is SchemaNodeGroup {
  return hasKey(node.value, "type") && node.value.type === "group";
}

export function isSchemaNodeDescriptor(
  node: TreeNode,
): node is SchemaNodeDescriptor {
  return hasKey(node.value, "type") && node.value.type === "descriptor";
}

export function isSchemaNodeObject(
  node: TreeNode,
): node is SchemaNodeDescriptor {
  return (
    isSchemaNodeDescriptor(node) &&
    node.nodeType === SchemaNodeTypes.SchemaNodeObject
  );
}

export function isSchemaNodeArray(node: TreeNode): node is SchemaNodeArray {
  return (
    isSchemaNodeDescriptor(node) &&
    node.nodeType === SchemaNodeTypes.SchemaNodeArray
  );
}

export function isSchemaNodeBundle(node: TreeNode): node is SchemaNodeBundle {
  return (
    isSchemaNodeDescriptor(node) &&
    (node.nodeType === SchemaNodeTypes.SchemaNodeDocumentStore ||
      node.nodeType === SchemaNodeTypes.SchemaNodeComponent)
  );
}

export function isSchemaNodeParams(
  node: TreeNode,
): node is SchemaNodeParamsObject {
  return (
    isSchemaNodeObject(node) &&
    isDefined(node.parent) &&
    isSchemaNodeBundle(node.parent)
  );
}

export function isNodeJsonSchema(schema: JSONSchema): schema is NodeJsonSchema {
  return Object.hasOwn(schema, "__nodeType");
}

function hasKey<T extends string>(
  obj: unknown,
  key: T,
): obj is { [key in T]: unknown } {
  return Boolean(typeof obj === "object" && obj && key in obj);
}
