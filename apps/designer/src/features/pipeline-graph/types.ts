import type { JsonWithMetadata } from "@repo/json-schema";
import type { NameGenerator } from "@repo/name-generator";
import type { NodeJsonSchema } from "@repo/node-specs/types";

import type {
  SchemaNodeComponent,
  SchemaNodeDocumentStore,
} from "@/features/json-schema-reflection";

import type {
  ConnectionSocket,
  PipelineSockets,
} from "./pipeline-sockets/types";

export type * from "./pipeline-sockets/types";

export type NodeParamNames = "init" | "input" | "output";

export interface PipelineComponent {
  state: {
    id: string;
    name: string;
    schema: NodeJsonSchema;
    schemaNode: SchemaNodeComponent;
    isReady: boolean;
  };
}

export interface PipelineDocumentStore {
  state: {
    id: string;
    name: string;
    schemaNode: SchemaNodeDocumentStore;
    schema: NodeJsonSchema;
    isReady: boolean;
  };
}

export type PipelineComponentId = PipelineComponent["state"]["id"];

export interface PipelineConnection {
  state: {
    id: string;
    source: ConnectionSocket;
    sourceNode: PipelineComponent;
    target: ConnectionSocket;
    targetNode: PipelineComponent;
  };
}

export type PipelineDataContainer = Record<NodeParamNames, JsonWithMetadata>;

export interface PipelineDataPointer {
  nodeName: string;
  nodeType: "components" | "documentStores";
  paramsType: NodeParamNames;
}

export interface PipelineData {
  state: {
    parameters: Record<string, unknown>;
    components: Record<string, PipelineDataContainer>;
    documentStores: Record<string, PipelineDataContainer>;
  };

  actions: {
    updateParameters: (parameters: Record<string, unknown>) => void;

    updateData: (options: {
      pointer: PipelineDataPointer;
      newData: JsonWithMetadata;
      createCopy?: boolean;
    }) => void;

    getData: (options: {
      pointer: PipelineDataPointer;
      createCopy?: boolean;
    }) => JsonWithMetadata;
  };
}

export interface PipelineGraph {
  state: {
    id: string;
    components: Map<string, PipelineComponent>;
    connections: Map<string, PipelineConnection>;
    sockets: PipelineSockets;
  };
  actions: {
    addComponent: (schema: SchemaNodeComponent) => PipelineComponent;

    addConnection: (
      source: ConnectionSocket,
      target: ConnectionSocket,
    ) => PipelineConnection;

    getComponent: (id: PipelineComponentId) => PipelineComponent | undefined;

    removeComponent: (id: PipelineComponentId) => boolean;

    getConnection: (
      id: PipelineConnection["state"]["id"],
    ) => PipelineConnection | undefined;

    removeConnection: (id: PipelineConnection["state"]["id"]) => boolean;

    addDocumentStore: (
      schema: SchemaNodeDocumentStore,
    ) => PipelineDocumentStore;

    removeDocumentStore: (id: PipelineDocumentStore["state"]["id"]) => void;
  };
}

export interface PipelineGraphContext extends Record<string, unknown> {
  components: Map<string, PipelineComponent>;
  connections: Map<string, PipelineConnection>;
  sockets: PipelineSockets;

  componentNameGenerator: NameGenerator;
  documentStoreNameGenerator: NameGenerator;
}
