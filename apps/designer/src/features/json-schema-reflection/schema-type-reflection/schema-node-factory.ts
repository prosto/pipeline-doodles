import type { $Refs, JSONSchema } from "@repo/json-schema";
import { isDefined } from "@repo/shared/utils";
import type {
  NodeFactory,
  TreeNode,
  TreeNodeOptions,
} from "@repo/shared/utils";

import { type SchemaRepository } from "../schema-repository";

import { reflectionContext } from "./reflection-context";
import { schemaNodeArray } from "./schema-node-array";
import { schemaNodeComponent } from "./schema-node-component";
import { schemaNodeDescriptor } from "./schema-node-descriptor";
import { schemaNodeDocumentStore } from "./schema-node-document-store";
import { schemaNodeGroup } from "./schema-node-group";
import { schemaNodeObject } from "./schema-node-object";
import { schemaNodeProtocol } from "./schema-node-protocol";
import { schemaNodeUnion } from "./schema-node-union";
import type {
  SchemaNode,
  SchemaNodeData,
  SchemaNodeDescriptorData,
  SchemaNodeFactory,
} from "./types";

interface SchemaNodeFactoryProps {
  schema: JSONSchema;
  $refs: $Refs;
  schemaRepository: SchemaRepository;
}

export function schemaNodeFactory(
  options: SchemaNodeFactoryProps,
): SchemaNodeFactory {
  const createNodeWithinContext: SchemaNodeFactory = reflectionContext.bind(
    {
      ...options,

      get nodeFactory() {
        return createNodeWithinContext;
      },
    },
    createNode,
  );

  const nodeFactory = createNodeWithinContext as NodeFactory<SchemaNode>;

  function createNode<T extends SchemaNodeData = SchemaNodeData>(
    value: T,
    parent: TreeNode<SchemaNodeData> | null = null,
  ): SchemaNode {
    if (value.type === "descriptor") {
      const nodeOptions: TreeNodeOptions<SchemaNodeDescriptorData> = {
        value,
        parent,
        nodeFactory,
      };

      const schema = value.descriptor.schema;
      const schemaType = schema.type;

      if (schema.__nodeType === "protocol") {
        return schemaNodeProtocol(nodeOptions);
      } else if (isDefined(schema.anyOf)) {
        return schemaNodeUnion(nodeOptions);
      } else if (schema.__nodeType === "component") {
        return schemaNodeComponent(nodeOptions);
      } else if (schema.__nodeType === "document-store") {
        return schemaNodeDocumentStore(nodeOptions);
      } else if (schemaType === "object") {
        return schemaNodeObject(nodeOptions);
      } else if (schemaType === "array") {
        return schemaNodeArray(nodeOptions);
      }

      return schemaNodeDescriptor(nodeOptions);
    }

    return schemaNodeGroup({
      value,
      parent,
      nodeFactory,
    });
  }

  return createNodeWithinContext;
}
