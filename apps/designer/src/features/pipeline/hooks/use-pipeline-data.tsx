import type { PipelineData } from "@/features/pipeline-graph/types";

import { usePipelineContext } from "./use-pipeline";

export function usePipelineData(): PipelineData {
  const {
    state: { context },
  } = usePipelineContext();

  return context.pipelineData;
}
