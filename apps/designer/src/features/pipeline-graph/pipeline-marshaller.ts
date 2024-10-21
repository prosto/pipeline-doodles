import type {
  JSONObject,
  JSONSchema,
  JSONValue,
  JsonWithMetadata,
} from "@repo/json-schema";
import { nodeJsonSchemaReader } from "@repo/node-specs/registry";
import type { NodeJsonSchema } from "@repo/node-specs/types";
import { isObject } from "lodash-es";

import type {} from "../json-schema-form/store/types";

import type { PipelineData, PipelineGraph } from "./types";

export interface PipelineMarshaller {
  marshal: () => Promise<JSONObject>;
}

interface MarshalledPipeline extends JSONObject {
  components: JSONObject;
  connections: JSONValue[];
}

export function pipelineMarshaller({
  pipelineGraph,
  pipelineData,
}: {
  pipelineGraph: PipelineGraph;
  pipelineData: PipelineData;
}): PipelineMarshaller {
  const jsonReader = nodeJsonSchemaReader();

  const {
    state: { components, connections },
  } = pipelineGraph;

  const {
    actions: { getData },
  } = pipelineData;

  async function marshalJsonValue(
    propertyValue: JSONValue,
    metadata: JsonWithMetadata["metadata"],
    propertyPath: string[],
  ): Promise<JSONValue> {
    if (isObject(propertyValue) && !Array.isArray(propertyValue)) {
      return marshalObject(propertyValue as JSONObject, metadata, propertyPath);
    } else if (Array.isArray(propertyValue)) {
      return marshalArray(propertyValue, metadata, propertyPath);
    }
    return propertyValue;
  }

  async function marshalArray(
    jsonArray: JSONValue[],
    metadata: JsonWithMetadata["metadata"],
    propertyPath: string[] = [],
  ): Promise<JSONValue[]> {
    const arrayValues: JSONValue[] = [];
    for (const [index, arrayValue] of jsonArray.entries()) {
      arrayValues.push(
        await marshalJsonValue(arrayValue, metadata, [
          ...propertyPath,
          String(index),
        ]),
      );
    }
    return arrayValues;
  }

  async function marshalObject(
    jsonObject: JSONObject,
    metadata: JsonWithMetadata["metadata"],
    propertyPath: string[] = [],
    schema?: JSONSchema | string,
  ): Promise<JSONObject> {
    const propertiesData: Record<string, JSONValue> = {};
    for (const [propertyName, propertyValue] of Object.entries(jsonObject)) {
      /*eslint no-await-in-loop: "off" -- Fix later*/
      propertiesData[propertyName] = await marshalJsonValue(
        propertyValue,
        metadata,
        [...propertyPath, propertyName],
      );
    }

    const keyPath = propertyPath.join(".");
    let metaSchema = schema;

    if (!metaSchema && Object.hasOwn(metadata, keyPath)) {
      const meta = metadata[keyPath];
      metaSchema = meta.schema;
    }

    if (metaSchema) {
      const [resolverSchema] = await jsonReader.resolveWithSchema(metaSchema);
      if (isNodeJsonSchema(resolverSchema)) {
        return {
          init_parameters: {
            ...propertiesData,
          },
          type: `${resolverSchema.__pyModule}.${resolverSchema.__pyType}`,
        };
      }
    }

    return propertiesData;
  }

  async function marshalComponents(
    jsonData: MarshalledPipeline,
  ): Promise<void> {
    for (const component of components.values()) {
      const {
        state: { schema, name },
      } = component;

      const componentData = getData({
        pointer: {
          nodeName: name,
          nodeType: "components",
          paramsType: "init",
        },
      });
      const { value, metadata } = componentData;

      Object.assign(jsonData.components, {
        [name]: await marshalObject(value, metadata, [], schema),
      });
    }
  }

  function marshalConnections(jsonData: MarshalledPipeline): void {
    for (const connection of connections.values()) {
      const {
        state: { source, target },
      } = connection;

      jsonData.connections.push({
        receiver: `${target.nodeName}.${target.name}`,
        sender: `${source.nodeName}.${source.name}`,
      });
    }
  }

  function marshalParameters(jsonData: MarshalledPipeline): void {
    Object.assign(jsonData, pipelineData.state.parameters);
  }

  async function marshal(): Promise<JSONObject> {
    const jsonData: MarshalledPipeline = {
      components: {},
      connections: [],
    };

    await marshalComponents(jsonData);

    marshalConnections(jsonData);

    marshalParameters(jsonData);

    return jsonData;
  }

  return { marshal };
}

function isNodeJsonSchema(schema: JSONSchema): schema is NodeJsonSchema {
  return Object.hasOwn(schema, "__nodeType");
}
