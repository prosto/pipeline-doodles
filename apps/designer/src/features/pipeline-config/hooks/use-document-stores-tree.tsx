import type { PipelinePanel } from "../store/types";

import { usePipelineConfig } from "./use-config";

export function useDocumentStoresTree(): PipelinePanel["documentStores"] {
  const {
    state: { panels },
  } = usePipelineConfig();

  return panels.pipeline.documentStores;
}
