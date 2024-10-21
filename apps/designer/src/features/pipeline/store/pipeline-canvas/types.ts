import type { NodeJsonSchema } from "@repo/node-specs/types";

import type {
  CanvasAction,
  CanvasActionName,
  UnavailableCanvasAction,
} from "@/features/excalidraw";

export interface PipelineCanvas {
  actions: {
    addElementsFromSchema: (
      schema: NodeJsonSchema,
      position: { clientX: number; clientY: number } | "cursor" | "center",
    ) => Promise<void>;

    canvasAction: (
      name: CanvasActionName,
    ) => CanvasAction | UnavailableCanvasAction;
  };
}
