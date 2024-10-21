import type { PropsWithChildren } from "react";
import { createContext } from "react";

import type { SchemaEditorStore } from "../store/types";

export const SchemaEditorContext = createContext<SchemaEditorStore | undefined>(
  undefined,
);

interface SchemaEditorProviderProps {
  editorStore?: SchemaEditorStore;
}

export function SchemaEditorProvider({
  children,
  editorStore,
}: PropsWithChildren<SchemaEditorProviderProps>): JSX.Element {
  return (
    <SchemaEditorContext.Provider value={editorStore}>
      {children}
    </SchemaEditorContext.Provider>
  );
}
