import { isJsonSchema } from "@repo/json-schema";
import type { TreeNodeOptions } from "@repo/shared/utils";
import { isDefined, mixin } from "@repo/shared/utils";

import type { SchemaPropertyDescriptor } from "@/features/json-schema-reflection/types";

import { schemaDescriptorFactory } from "../schema-descriptor";

import { extraProperties } from "./schema-extra-nodes";
import { schemaNodeDescriptor } from "./schema-node-descriptor";
import type {
  SchemaNodeArray,
  SchemaNodeDescriptor,
  SchemaNodeDescriptorData,
} from "./types";
import { SchemaNodeTypes } from "./types";

interface SchemaNodeArrayState {
  items: SchemaNodeDescriptor[];
  anyItems: boolean;
  prefixItems: SchemaNodeDescriptor[];
  extraItems: SchemaNodeDescriptor[];
}

export function schemaNodeArray(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeArray {
  const node = schemaNodeDescriptor(options);
  const arraySchema = node.schema;

  const state: SchemaNodeArrayState = {
    items: [],
    anyItems: false,
    prefixItems: [],
    extraItems: [],
  };

  async function createItems(): Promise<void> {
    const itemsSchema = arraySchema.items;

    if (isJsonSchema(itemsSchema)) {
      state.items.push(
        await node
          .addDescriptorNode(
            schemaDescriptorFactory({
              schema: itemsSchema,
              parentSchema: arraySchema,
              isOptional: true,
            }),
          )
          .buildNode(),
      );
    } else if (itemsSchema === false || !isDefined(itemsSchema)) {
      state.anyItems = true;
    }
  }

  async function createPrefixItems(): Promise<void> {
    const prefixItemsSchema = arraySchema.prefixItems;

    if (Array.isArray(prefixItemsSchema)) {
      const prefixItemsNodes = await Promise.all(
        prefixItemsSchema.map((prefixItemSchema) =>
          node
            .addDescriptorNode(
              schemaDescriptorFactory({
                schema: prefixItemSchema,
                parentSchema: arraySchema,
                isOptional: false,
                isAdditional: false,
                isResolved: true,
              }),
            )
            .buildNode(),
        ),
      );
      state.prefixItems.push(...prefixItemsNodes);
    }
  }

  return mixin(node, {
    nodeType: SchemaNodeTypes.SchemaNodeArray,

    get items() {
      return state.items;
    },

    get anyItems() {
      return state.anyItems;
    },

    get dynamicItems() {
      if (state.anyItems && state.extraItems.length === 0) {
        state.extraItems.push(...extraProperties);
      }
      return state.extraItems;
    },

    get prefixItems() {
      return state.prefixItems;
    },

    findMatchingItem({ id }: SchemaPropertyDescriptor) {
      return node
        .getRequiredGroup("dynamicItems")
        .getChildren<SchemaNodeDescriptor>()
        .find(({ descriptor }) => descriptor.id === id);
    },

    async buildNode() {
      await createItems();

      await createPrefixItems();

      return node;
    },
  });
}
