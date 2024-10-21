import { createContext } from "@/features/context";

import type { PipelineEditorStoreContext } from "./types";

export const storeContext = createContext<PipelineEditorStoreContext>();
