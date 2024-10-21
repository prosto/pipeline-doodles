import type { TreeNodeOptions } from "@repo/shared/utils";
import { ensureIsDefined, mixin } from "@repo/shared/utils";

import { schemaDescriptorFactory } from "../schema-descriptor";

import { schemaNodeBundle } from "./schema-node-bundle";
import { schemaNodeParams } from "./schema-node-params";
import { SchemaNodeTypes } from "./types";
import type {
  SchemaNodeDescriptorData,
  SchemaNodeDocumentStore,
  SchemaNodeObject,
} from "./types";

interface SchemaNodeState {
  init?: SchemaNodeObject;
}

export function schemaNodeDocumentStore(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeDocumentStore {
  const bundleNode = schemaNodeBundle(options);
  const { schema } = bundleNode;

  const state: SchemaNodeState = {};

  const documentStoreNode = mixin(bundleNode, {
    nodeType: SchemaNodeTypes.SchemaNodeDocumentStore,

    get init() {
      return ensureIsDefined(state.init);
    },

    async buildNode() {
      const { initParameters } = ensureIsDefined(schema.$defs);

      const initParams = schemaNodeParams({
        value: {
          descriptor: schemaDescriptorFactory({
            schema: initParameters,
            parentSchema: schema,
            isResolved: true,
          }),
          type: "descriptor",
        },
        parent: documentStoreNode,
        nodeFactory: options.nodeFactory,
        paramsType: "init",
      });

      Object.assign(state, {
        init: await initParams.buildNode(),
      });

      return documentStoreNode;
    },
  });

  return documentStoreNode;
}
