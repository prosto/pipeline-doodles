import type { $Refs, JSONSchema } from "@repo/json-schema";
import type { NodeJsonSchema } from "@repo/node-specs/types";
import type {
  NodeFactory,
  TreeNode,
  TreeNodeOptions,
} from "@repo/shared/utils";

import type { SchemaPropertyDescriptor } from "@/features/json-schema-reflection/types";

import type { SchemaRepository } from "../schema-repository";

export type SchemaNodeFactory = <T extends SchemaNodeData = SchemaNodeData>(
  value: T,
  parent?: TreeNode<SchemaNodeData> | null,
) => SchemaNode;

export interface ReflectionContext extends Record<string, unknown> {
  schema: JSONSchema;
  $refs: $Refs;
  schemaRepository: SchemaRepository;
  nodeFactory: SchemaNodeFactory;
}

export enum SchemaNodeTypes {
  SchemaNode = "SchemaNode",
  SchemaNodeGroup = "SchemaNodeGroup",
  SchemaNodeComponent = "SchemaNodeComponent",
  SchemaNodeDocumentStore = "SchemaNodeDocumentStore",
  SchemaNodeObject = "SchemaNodeObject",
  SchemaNodeArray = "SchemaNodeArray",
  SchemaNodeProtocol = "SchemaNodeProtocol",
  SchemaNodeUnion = "SchemaNodeUnion",
}

export interface SchemaNodeGroupData extends Record<string, unknown> {
  type: "group";
  name: string;
}

export interface SchemaNodeDescriptorData extends Record<string, unknown> {
  type: "descriptor";
  descriptor: SchemaPropertyDescriptor;
}

export type SchemaNodeData = SchemaNodeGroupData | SchemaNodeDescriptorData;

export interface SchemaNodeOptions<T extends SchemaNodeData = SchemaNodeData>
  extends TreeNodeOptions<T> {
  schemaRepository: SchemaRepository;
  nodeFactory: NodeFactory;
}

export interface SchemaNode<T extends SchemaNodeData = SchemaNodeData>
  extends TreeNode<T> {
  readonly parent: SchemaNode<T> | null;

  readonly id: string;
  readonly nodeType: SchemaNodeTypes;

  readonly title?: string;
  readonly description?: string;

  getRootNode: () => SchemaNodeDescriptor;
  getRootSchema: () => JSONSchema;

  addGroup: (name: string) => SchemaNodeGroup;
  getGroup: (name: string) => SchemaNodeGroup | undefined;
  getRequiredGroup: (name: string) => SchemaNodeGroup;

  addDescriptorNode: (
    descriptor: SchemaPropertyDescriptor,
  ) => SchemaNodeDescriptor;

  getChildren: <NodeType extends SchemaNode>() => NodeType[];

  buildNode: () => Promise<this> | this;
}

export interface SchemaNodeGroup extends SchemaNode<SchemaNodeGroupData> {
  readonly name: string;
}

export interface SchemaNodeDescriptor
  extends SchemaNode<SchemaNodeDescriptorData> {
  readonly descriptor: SchemaPropertyDescriptor;
  readonly schema: JSONSchema;
  readonly schemaId?: string;
  readonly dynamicSchemaId?: string;
  readonly propertyName?: string;
  readonly isOptional: boolean;
  readonly schemaType?: JSONSchema["type"];
  readonly parentSchemaType?: JSONSchema["type"];
  readonly defaultValue?: unknown;

  readonly variadic: boolean;
  readonly isPrimitive: boolean;

  readonly variantId: string;
  readonly hasVariants: boolean;
  readonly variants: SchemaNodeDescriptor[];
  readonly allVariants: () => Generator<SchemaNodeDescriptor>;
  readonly defaultVariant?: SchemaNodeDescriptor;
}

export interface SchemaNodePropertyDescriptor extends SchemaNodeDescriptor {
  readonly propertyName: string;
}

export interface SchemaNodeArray extends SchemaNodeDescriptor {
  readonly prefixItems: SchemaNodeDescriptor[];
  readonly items: SchemaNodeDescriptor[];
  readonly anyItems: boolean;
  readonly dynamicItems: SchemaNodeDescriptor[];

  findMatchingItem: (
    descriptor: SchemaPropertyDescriptor,
  ) => SchemaNodeDescriptor | undefined;
}

export interface SchemaNodeBundle extends SchemaNodeDescriptor {
  readonly init?: SchemaNodeParamsObject;
  readonly input?: SchemaNodeParamsObject;
  readonly output?: SchemaNodeParamsObject;
  readonly schema: NodeJsonSchema;
}

export interface SchemaNodeComponent extends SchemaNodeBundle {
  readonly init: SchemaNodeParamsObject;
  readonly input: SchemaNodeParamsObject;
  readonly output: SchemaNodeParamsObject;
}

export interface SchemaNodeDocumentStore extends SchemaNodeBundle {
  readonly init: SchemaNodeParamsObject;
}

export interface SchemaNodeObject extends SchemaNodeDescriptor {
  readonly properties: SchemaNodePropertyDescriptor[];
  readonly additionalProperties: SchemaNodeDescriptor[];
  readonly dynamicProperties: SchemaNodeDescriptor[];

  getPropertyByName: (name: string) => SchemaNodePropertyDescriptor | undefined;

  findDynamicProperty: (
    descriptor: SchemaPropertyDescriptor,
  ) => SchemaNodeDescriptor | undefined;
}

export interface SchemaNodeParamsObject extends SchemaNodeObject {
  readonly parent: SchemaNodeBundle;
  paramsType: "init" | "input" | "output";
}

export interface SchemaNodeProtocol extends SchemaNodeDescriptor {
  readonly variants: SchemaNodeDescriptor[];
}

export interface SchemaNodeUnion extends SchemaNodeDescriptor {
  readonly variants: SchemaNodeDescriptor[];
}

export interface SchemaTypeReflection {
  buildReflectionTree: (
    schema: JSONSchema | string,
    refPath?: string,
  ) => Promise<SchemaNodeDescriptor>;
}
