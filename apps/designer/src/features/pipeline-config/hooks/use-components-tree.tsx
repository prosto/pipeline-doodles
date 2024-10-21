import type { PipelinePanel } from "../store/types";

import { usePipelineConfig } from "./use-config";

export function useComponentsTree(): PipelinePanel["components"] {
  const {
    state: { panels },
  } = usePipelineConfig();

  return panels.pipeline.components;
}
