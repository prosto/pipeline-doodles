import type { EditorView } from "@/features/editor/store";

import { useEditorActions } from "./use-editor";

export function useEditorView(id: string): EditorView {
  const { getViewById } = useEditorActions();

  const editorView = getViewById(id);

  if (editorView === undefined) {
    throw new Error(`useEditorView can not find editor view by id: ${id}`);
  }

  return editorView;
}
