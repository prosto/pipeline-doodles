import { usePipelineContext } from "@/features/pipeline/hooks/use-pipeline";

import type { PipelineConfig } from "../store/types";

export function usePipelineConfig(): PipelineConfig {
  const {
    state: { context },
  } = usePipelineContext();
  return context.pipelineConfig;
}

export function usePipelineConfigActions(): PipelineConfig["actions"] {
  const config = usePipelineConfig();
  return config.actions;
}
