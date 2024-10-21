import type { JSONSchema } from "@repo/json-schema";
import type { TreeNodeOptions } from "@repo/shared/utils";
import { isDefined, mixin, once } from "@repo/shared/utils";

import type { SchemaPropertyDescriptor } from "@/features/json-schema-reflection/types";

import { schemaDescriptorFactory } from "../schema-descriptor";

import { extraProperties } from "./schema-extra-nodes";
import { schemaNodeDescriptor } from "./schema-node-descriptor";
import { SchemaNodeTypes } from "./types";
import type {
  SchemaNodeDescriptor,
  SchemaNodeDescriptorData,
  SchemaNodeObject,
  SchemaNodePropertyDescriptor,
} from "./types";

interface SchemaNodeObjectState {
  properties: SchemaNodePropertyDescriptor[];
  additionalProperties: SchemaNodeDescriptor[];
  dynamicProperties: SchemaNodeDescriptor[];
  anyItems: boolean;
}

export function schemaNodeObject(
  options: TreeNodeOptions<SchemaNodeDescriptorData>,
): SchemaNodeObject {
  const node = schemaNodeDescriptor(options);
  const { schema } = node;

  const state: SchemaNodeObjectState = {
    properties: [],
    additionalProperties: [],
    dynamicProperties: [],
    anyItems: false,
  };

  async function createProperties(): Promise<void> {
    const objectProperties = schema.properties ?? {};
    const requiredProperties = schema.required ?? [];

    const propertyDescriptors = Object.entries(objectProperties).map(
      ([key, value]) => {
        const valueSchema = value as JSONSchema;
        const isOptional = !requiredProperties.includes(key);

        return schemaDescriptorFactory({
          name: key,
          schema: valueSchema,
          parentSchema: schema,
          isOptional,
          isResolved: true,
        });
      },
    );

    const properties = await Promise.all(
      propertyDescriptors.map((descriptor) =>
        node.addDescriptorNode(descriptor).buildNode(),
      ),
    );

    state.properties.push(...(properties as SchemaNodePropertyDescriptor[]));
  }

  async function createAdditionalProperties(): Promise<void> {
    const additionalProperties = schema.additionalProperties;

    if (typeof additionalProperties === "object") {
      state.additionalProperties.push(
        await node
          .addDescriptorNode(
            schemaDescriptorFactory({
              schema: additionalProperties,
              isResolved: false,
              isOptional: true,
              isAdditional: true,
            }),
          )
          .buildNode(),
      );
    }
  }

  function createDynamicProperties(): void {
    const additionalProperties = schema.additionalProperties;
    if (!isDefined(additionalProperties) || additionalProperties === true) {
      state.anyItems = true;
    }
  }

  const getDynamicProperties = once(() =>
    state.anyItems ? [...extraProperties] : [],
  );

  return mixin(node, {
    nodeType: SchemaNodeTypes.SchemaNodeObject,

    get properties() {
      return state.properties;
    },

    get additionalProperties() {
      return state.additionalProperties;
    },

    get dynamicProperties() {
      return getDynamicProperties();
    },

    getPropertyByName(name: string) {
      return this.properties.find((n) => n.propertyName === name);
    },

    findDynamicProperty({ id }: SchemaPropertyDescriptor) {
      return getDynamicProperties().find(
        ({ value }) => value.descriptor.id === id,
      );
    },

    async buildNode() {
      await createProperties();

      await createAdditionalProperties();

      createDynamicProperties();

      return node;
    },
  });
}
