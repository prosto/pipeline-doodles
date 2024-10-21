import { editorStore, type Editor } from "@/features/editor/store";

export function useEditor(): Editor {
  return editorStore;
}

export function useEditorState(): Editor["state"] {
  const editor = useEditor();
  return editor.state;
}

export function useEditorActions(): Editor["actions"] {
  const editor = useEditor();
  return editor.actions;
}
