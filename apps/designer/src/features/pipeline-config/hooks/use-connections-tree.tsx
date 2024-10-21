import type { PipelinePanel } from "../store/types";

import { usePipelineConfig } from "./use-config";

export function useConnectionsTree(): PipelinePanel["connections"] {
  const {
    state: { panels },
  } = usePipelineConfig();

  return panels.pipeline.connections;
}
