import type { ReactNode } from "react";
import { useRef, createContext } from "react";

import type { Editor } from "@/features/editor/store";
import { editorFactory } from "@/features/editor/store";

export const EditorContext = createContext<Editor | undefined>(undefined);

interface EditorProviderProviderProps {
  editor?: Editor;
  children: ReactNode;
}

export function EditorProvider({
  children,
  editor,
}: EditorProviderProviderProps): JSX.Element {
  const state = useRef(editor || editorFactory()).current;

  return (
    <EditorContext.Provider value={state}>{children}</EditorContext.Provider>
  );
}
