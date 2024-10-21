import { getId } from "@repo/shared/utils";
import { proxy } from "valtio";

import type { SchemaNodeDocumentStore } from "@/features/json-schema-reflection";

import { pipelineGraphContext } from "./pipeline-graph-context";
import type { PipelineDocumentStore } from "./types";

interface FactoryProps {
  schemaNode: SchemaNodeDocumentStore;
}

export function pipelineDocumentStoreFactory({
  schemaNode,
}: FactoryProps): PipelineDocumentStore {
  const {
    documentStoreNameGenerator: { generateName },
  } = pipelineGraphContext.useX();

  const id = getId();
  const { schema } = schemaNode;

  const state: PipelineDocumentStore["state"] = proxy({
    id,
    name: generateName({
      syllables: 2,
      firstValue: String(schema.__defaultName),
    }),

    schema,
    schemaNode,

    isReady: true,
  });

  return {
    state,
  };
}
