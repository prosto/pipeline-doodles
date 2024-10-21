import type { PropsWithChildren } from "react";
import { useRef, createContext } from "react";

import { pipelineFactory } from "@/features/pipeline/store";
import type { Pipeline } from "@/features/pipeline/store";

export const PipelineContext = createContext<Pipeline | undefined>(undefined);

interface PipelineStateProviderProps {
  pipeline?: Pipeline;
}

export function PipelineStateProvider({
  children,
  pipeline,
}: PropsWithChildren<PipelineStateProviderProps>): JSX.Element {
  const state = useRef(pipeline || pipelineFactory()).current;

  return (
    <PipelineContext.Provider value={state}>
      {children}
    </PipelineContext.Provider>
  );
}
