import type { TreeNodeOptions } from "@repo/shared/utils";
import { ensureIsDefined, mixin } from "@repo/shared/utils";

import { schemaDescriptorFactory } from "../schema-descriptor";

import { schemaNodeBundle } from "./schema-node-bundle";
import { schemaNodeParams } from "./schema-node-params";
import { SchemaNodeTypes } from "./types";
import type {
  SchemaNodeDescriptorData,
  SchemaNodeComponent,
  SchemaNodeObject,
} from "./types";

interface SchemaNodeComponentState {
  init?: SchemaNodeObject;
  input?: SchemaNodeObject;
  output?: SchemaNodeObject;
}

export function schemaNodeComponent(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeComponent {
  const bundleNode = schemaNodeBundle(options);
  const { schema } = bundleNode;

  const state: SchemaNodeComponentState = {};

  const componentNode = mixin(bundleNode, {
    nodeType: SchemaNodeTypes.SchemaNodeComponent,

    get init() {
      return ensureIsDefined(state.init);
    },

    get input() {
      return ensureIsDefined(state.input);
    },

    get output() {
      return ensureIsDefined(state.output);
    },

    async buildNode() {
      const { initParameters, inputTypes, outputTypes } = ensureIsDefined(
        schema.$defs,
      );

      const initParams = schemaNodeParams({
        value: {
          descriptor: schemaDescriptorFactory({
            schema: initParameters,
            parentSchema: schema,
            isResolved: true,
          }),
          type: "descriptor",
        },
        parent: componentNode,
        nodeFactory: options.nodeFactory,
        paramsType: "init",
      });

      const inputParams = schemaNodeParams({
        value: {
          descriptor: schemaDescriptorFactory({
            schema: inputTypes,
            parentSchema: schema,
            isResolved: true,
          }),
          type: "descriptor",
        },
        parent: componentNode,
        nodeFactory: options.nodeFactory,
        paramsType: "input",
      });

      const outputParams = schemaNodeParams({
        value: {
          descriptor: schemaDescriptorFactory({
            schema: outputTypes,
            parentSchema: schema,
            isResolved: true,
          }),
          type: "descriptor",
        },
        parent: componentNode,
        nodeFactory: options.nodeFactory,
        paramsType: "input",
      });

      Object.assign(state, {
        init: await initParams.buildNode(),
        input: await inputParams.buildNode(),
        output: await outputParams.buildNode(),
      });

      return componentNode;
    },
  });

  return componentNode;
}
