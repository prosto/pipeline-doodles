import { dump as dumpToYaml } from "js-yaml";
import { proxy } from "valtio";

import type { PipelineJsonEditorTab } from "../editor/store/types";

import type { PipelineDefEditorStore } from "./types";

export function pipelineDefEditorStore({
  editorTab,
}: {
  editorTab: PipelineJsonEditorTab;
}): PipelineDefEditorStore {
  const state = proxy({
    mode: editorTab.data.mode ?? "yaml",

    editorValue: editorTab.data.json,

    get formattedEditorValue() {
      if (state.mode === "json") {
        return JSON.stringify(state.editorValue, null, 4);
      }
      return dumpToYaml(state.editorValue);
    },
  });

  const actions = {
    changeMode(mode: "json" | "yaml") {
      editorTab.data.mode = mode;
      state.mode = mode;
    },
  };

  return {
    state,
    actions,
  };
}
