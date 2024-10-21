import type { ExcalidrawStore } from "@/features/excalidraw";

import type {
  CanvasComponents,
  CanvasConnections,
  CanvasElements,
} from "../store/canvas-elements/types";
import type { EditingConnection } from "../store/editing-connection/types";
import type { PipelineCanvas } from "../store/pipeline-canvas";

import { usePipelineContext } from "./use-pipeline";

export function usePipelineCanvas(): PipelineCanvas {
  const {
    state: { context },
  } = usePipelineContext();

  return context.pipelineCanvas;
}

export function useCanvasElements(): CanvasElements {
  const {
    state: { context },
  } = usePipelineContext();

  return context.canvasElements;
}

export function useExcalidrawStore(): ExcalidrawStore {
  const {
    state: { context },
  } = usePipelineContext();

  return context.excalidrawStore;
}

export function useCanvasComponents(): CanvasComponents {
  const {
    state: { components },
  } = useCanvasElements();

  return components;
}

export function useCanvasConnections(): CanvasConnections {
  const {
    state: { connections },
  } = useCanvasElements();

  return connections;
}

export function useCanvasEditingConnection(): EditingConnection {
  const {
    state: { context },
  } = usePipelineContext();

  return context.editingConnection;
}
