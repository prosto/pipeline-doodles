import { createContext } from "@/features/context";

import type { CanvasContext } from "./types";

export const canvasContext = createContext<CanvasContext>();
