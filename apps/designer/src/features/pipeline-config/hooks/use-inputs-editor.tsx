import type { PipelinePanel } from "../store/types";

import { usePipelineConfig } from "./use-config";

export function useInputsDataEditor(): PipelinePanel["inputsEditor"] {
  const {
    state: { panels },
  } = usePipelineConfig();

  return panels.pipeline.inputsEditor;
}
