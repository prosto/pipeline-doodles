export type EditorMode = "json" | "yaml";

export interface PipelineDefEditorStore {
  state: {
    mode: EditorMode;
    editorValue: object;
    readonly formattedEditorValue: string;
  };
  actions: {
    changeMode: (mode: EditorMode) => void;
  };
}
