import { createContext } from "@/features/context";

import type { PipelineGraphContext } from "./types";

export const pipelineGraphContext = createContext<PipelineGraphContext>();
