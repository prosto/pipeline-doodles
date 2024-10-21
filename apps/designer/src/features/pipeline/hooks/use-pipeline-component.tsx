import type { PipelineComponent } from "@/features/pipeline-graph/types";

import { usePipelineGraph } from "./use-pipeline-graph";

export function usePipelineComponent(componentId: string): PipelineComponent {
  const {
    actions: { getComponent: getNode },
  } = usePipelineGraph();

  const component = getNode(componentId);

  if (!component) {
    throw new Error(`Could not find component by id: ${componentId}`);
  }

  return component;
}
