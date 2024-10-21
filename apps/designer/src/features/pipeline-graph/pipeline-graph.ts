import { nameGenerator } from "@repo/name-generator";
import { getId } from "@repo/shared/utils";
import { proxyMap } from "valtio/utils";

import type {
  SchemaNodeComponent,
  SchemaNodeDocumentStore,
} from "../json-schema-reflection";

import { pipelineComponentFactory } from "./pipeline-component";
import { pipelineConnectionFactory } from "./pipeline-connection";
import { pipelineDocumentStoreFactory } from "./pipeline-document-store";
import { pipelineGraphContext } from "./pipeline-graph-context";
import { pipelineSocketsFactory } from "./pipeline-sockets/pipeline-sockets";
import type { ConnectionSocket } from "./pipeline-sockets/types";
import type {
  PipelineConnection,
  PipelineDocumentStore,
  PipelineGraph,
  PipelineComponent,
} from "./types";

export function pipelineGraphFactory(): PipelineGraph {
  const graphId = getId();

  const components = proxyMap<string, PipelineComponent>();
  const connections = proxyMap<string, PipelineConnection>();
  const documentStores = proxyMap<string, PipelineDocumentStore>();

  const componentNames = new Set<string>();
  const documentStoreNames = new Set<string>();

  const context = pipelineGraphContext.init(
    {
      components,
      connections,
      documentStores,
    },
    (bind) => {
      bind("componentNameGenerator", () =>
        nameGenerator({
          excludeNames: () => componentNames,
        }),
      );

      bind("documentStoreNameGenerator", () =>
        nameGenerator({
          excludeNames: () => documentStoreNames,
        }),
      );

      bind("sockets", pipelineSocketsFactory);
    },
  );

  const componentFactory = pipelineGraphContext.bind(
    context,
    pipelineComponentFactory,
  );

  const documentStoreFactory = pipelineGraphContext.bind(
    context,
    pipelineDocumentStoreFactory,
  );

  const connectionFactory = pipelineGraphContext.bind(
    context,
    pipelineConnectionFactory,
  );

  const { sockets } = context;

  const state: PipelineGraph["state"] = {
    id: graphId,
    components,
    connections,
    sockets,
  };

  const actions: PipelineGraph["actions"] = {
    addComponent(schemaNode: SchemaNodeComponent): PipelineComponent {
      const component = componentFactory({ schemaNode });
      components.set(component.state.id, component);

      sockets.onNewComponentAdded(component);

      return component;
    },

    getComponent(id: PipelineComponent["state"]["id"]) {
      return components.get(id);
    },

    removeComponent(id: PipelineComponent["state"]["id"]) {
      const componentToRemove = components.get(id);

      if (componentToRemove) {
        componentNames.delete(componentToRemove.state.name);
        sockets.onNodeRemoved(componentToRemove);
      }

      return components.delete(id);
    },

    addDocumentStore(
      schemaNode: SchemaNodeDocumentStore,
    ): PipelineDocumentStore {
      const ds = documentStoreFactory({
        schemaNode,
      });
      documentStores.set(ds.state.id, ds);

      return ds;
    },

    removeDocumentStore(id: PipelineDocumentStore["state"]["id"]) {
      const dsToRemove = documentStores.get(id);

      if (dsToRemove) {
        documentStoreNames.delete(dsToRemove.state.name);
      }

      return documentStores.delete(id);
    },

    addConnection(
      source: ConnectionSocket,
      target: ConnectionSocket,
    ): PipelineConnection {
      const connection = connectionFactory({
        source,
        target,
      });
      connections.set(connection.state.id, connection);
      sockets.onConnectionAdded(connection);

      return connection;
    },

    getConnection(id: PipelineConnection["state"]["id"]) {
      return connections.get(id);
    },

    removeConnection(id: PipelineConnection["state"]["id"]) {
      const connectionToRemove = connections.get(id);

      if (connectionToRemove) {
        sockets.onConnectionRemoved(connectionToRemove);
      }

      return connections.delete(id);
    },
  };

  return {
    state,
    actions,
  };
}
