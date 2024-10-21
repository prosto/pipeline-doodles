import { editorFactory } from "./editor";

export * from "./types";
export * from "./editor";
export * from "./editor-registry";

export const editorStore = editorFactory();
