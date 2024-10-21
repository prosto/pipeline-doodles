import type {
  ExcalidrawActions,
  ExcalidrawAPI,
  ExcalidrawStore,
} from "@/features/excalidraw";
import type { PipelineConfig } from "@/features/pipeline-config/store/types";
import type {
  PipelineData,
  PipelineGraph,
} from "@/features/pipeline-graph/types";

import type { CanvasElements } from "./canvas-elements/types";
import type { EditingConnection } from "./editing-connection";
import type { PipelineCanvas } from "./pipeline-canvas";

export interface PipelineEditorStoreContext extends Record<string, unknown> {
  excalidrawStore: ExcalidrawStore;
  excalidraw: ExcalidrawAPI;
  excalidrawActions: ExcalidrawActions;
  pipelineGraph: PipelineGraph;
  pipelineData: PipelineData;
  pipelineCanvas: PipelineCanvas;
  pipelineConfig: PipelineConfig;
  canvasElements: CanvasElements;
  editingConnection: EditingConnection;
}
