import type { ReactNode } from "react";
import { useRef, createContext } from "react";

import type { EditorTab } from "@/features/editor/store";

export const EditorTabContext = createContext<EditorTab | undefined>(undefined);

interface EditorTabProviderProviderProps {
  editorTab: EditorTab;
  children: ReactNode;
}

export function EditorTabProvider({
  children,
  editorTab,
}: EditorTabProviderProviderProps): JSX.Element {
  const state = useRef(editorTab).current;

  return (
    <EditorTabContext.Provider value={state}>
      {children}
    </EditorTabContext.Provider>
  );
}
