import { pipelineMarshaller } from "@/features/pipeline-graph";
import type { PipelineMarshaller } from "@/features/pipeline-graph/pipeline-marshaller";

import { usePipelineData } from "./use-pipeline-data";
import { usePipelineGraph } from "./use-pipeline-graph";

export function usePipelineMarshaller(): PipelineMarshaller {
  const pipelineGraph = usePipelineGraph();
  const pipelineData = usePipelineData();

  return pipelineMarshaller({ pipelineGraph, pipelineData });
}
