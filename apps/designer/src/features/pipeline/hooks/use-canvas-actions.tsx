import type {
  CanvasAction,
  CanvasActionName,
  UnavailableCanvasAction,
} from "@/features/excalidraw";

import { usePipelineCanvas } from "./use-canvas";

export function useCanvasAction(
  name: CanvasActionName,
): CanvasAction | UnavailableCanvasAction {
  const {
    actions: { canvasAction },
  } = usePipelineCanvas();

  return canvasAction(name);
}
