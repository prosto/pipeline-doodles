import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { PipelineJsonEditorTab } from "@/features/editor/store";
import { useSingleton } from "@repo/ui/hooks";

import { pipelineDefEditorStore } from "./editor-store";
import type { PipelineDefEditorStore } from "./types";

const EditorStoreContext = createContext<PipelineDefEditorStore | undefined>(
  undefined,
);

interface EditorStoreProviderProps {
  editorTab: PipelineJsonEditorTab;
  children: ReactNode;
}

export function EditorStoreProvider({
  children,
  editorTab,
}: EditorStoreProviderProps): JSX.Element {
  const store = useSingleton(() => pipelineDefEditorStore({ editorTab }));

  return (
    <EditorStoreContext.Provider value={store}>
      {children}
    </EditorStoreContext.Provider>
  );
}

export function useEditorStoreContext(): PipelineDefEditorStore {
  const editorStoreContext = useContext(EditorStoreContext);

  if (editorStoreContext === undefined) {
    throw new Error(
      "useEditorStoreContext can only be used in a EditorStoreProvider",
    );
  }

  return editorStoreContext;
}
