import { getId } from "@repo/shared/utils";
import { proxy } from "valtio";

import type { SchemaNodeComponent } from "@/features/json-schema-reflection";

import { pipelineGraphContext } from "./pipeline-graph-context";
import type { PipelineComponent } from "./types";

interface FactoryProps {
  schemaNode: SchemaNodeComponent;
}

export function pipelineComponentFactory({
  schemaNode,
}: FactoryProps): PipelineComponent {
  const {
    componentNameGenerator: { generateName },
  } = pipelineGraphContext.useX();

  const id = getId();
  const { schema } = schemaNode;

  const state = proxy<PipelineComponent["state"]>({
    id,

    name: generateName({
      syllables: 2,
      firstValue: String(schema.__defaultName),
    }),

    schemaNode,
    schema,

    isReady: true,
  });

  return {
    state,
  };
}
