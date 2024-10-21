import { getId } from "@repo/shared/utils";

import { excalidrawStoreFactory } from "@/features/excalidraw";
import { pipelineGraphFactory } from "@/features/pipeline-graph";
import { pipelineDataFactory } from "@/features/pipeline-graph/pipeline-data";

import { pipelineConfigFactory } from "../../pipeline-config/store/pipeline-config";

import { canvasElementsFactory } from "./canvas-elements";
import { editingConnectionFactory } from "./editing-connection";
import { pipelineCanvasFactory } from "./pipeline-canvas";
import { storeContext } from "./store-context";
import type { PipelineEditorStoreContext } from "./types";

export interface Pipeline {
  state: {
    id: string;
    name: string;
    isActive: boolean;
    hasChanges: boolean;
    context: PipelineEditorStoreContext;
  };
}

export function pipelineFactory({
  name = "Untitled-1",
  isActive = false,
  hasChanges = false,
}: Partial<Pipeline["state"]> = {}): Pipeline {
  const id = getId();

  const context = storeContext.init({ name }, (bind) => {
    const {
      state: { excalidraw, excalidrawActions },
    } = bind("excalidrawStore", excalidrawStoreFactory);

    bind("excalidraw", () => excalidraw);
    bind("excalidrawActions", () => excalidrawActions);

    bind("pipelineGraph", pipelineGraphFactory);

    bind("pipelineData", pipelineDataFactory);

    bind("canvasElements", canvasElementsFactory);

    bind("editingConnection", editingConnectionFactory);

    bind("pipelineCanvas", pipelineCanvasFactory);

    bind("pipelineConfig", pipelineConfigFactory);
  });

  const state: Pipeline["state"] = {
    id,
    isActive,
    name,
    hasChanges,
    context,
  };

  return {
    state,
  };
}
