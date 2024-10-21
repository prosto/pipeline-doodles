import type { PipelineGraph } from "@/features/pipeline-graph/types";

import { usePipelineContext } from "./use-pipeline";

export function usePipelineGraph(): PipelineGraph {
  const {
    state: { context },
  } = usePipelineContext();

  return context.pipelineGraph;
}
