import { useContext } from "react";

import { PipelineContext } from "../providers/pipeline-provider";
import type { Pipeline } from "../store/pipeline";

export function usePipelineContext(): Pipeline {
  const pipelineState = useContext(PipelineContext);

  if (pipelineState === undefined) {
    throw new Error(
      "usePipelineContext can only be used in a PipelineStateProvider tree",
    );
  }

  return pipelineState;
}
