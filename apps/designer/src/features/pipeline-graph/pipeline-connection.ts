import { getId, ensureIsDefined } from "@repo/shared/utils";
import { proxy, ref } from "valtio";

import { pipelineGraphContext } from "./pipeline-graph-context";
import type {
  ConnectionSocket,
  PipelineConnection,
  PipelineComponent,
} from "./types";

interface FactoryProps {
  source: ConnectionSocket;
  target: ConnectionSocket;
}

export function pipelineConnectionFactory({
  source,
  target,
}: FactoryProps): PipelineConnection {
  const { components } = pipelineGraphContext.useX();

  const id = getId();

  const state = proxy({
    id,
    source: ref(source),
    target: ref(target),

    get sourceNode(): PipelineComponent {
      return ensureIsDefined(components.get(state.source.nodeId));
    },

    get targetNode(): PipelineComponent {
      return ensureIsDefined(components.get(state.target.nodeId));
    },
  });

  return {
    state,
  };
}
