import { useContext } from "react";

import type { EditorTab } from "@/features/editor/store";

import { EditorTabContext } from "../editor-tab-provider";

import { useEditorView } from "./use-editor-view";

export function useEditorTab(viewId: string, tabId: string): EditorTab {
  const editorView = useEditorView(viewId);

  const editorTab = editorView.getTabById(tabId);

  if (editorTab === undefined) {
    throw new Error(`useEditorTab can not find editor tab by id: ${tabId}`);
  }

  return editorTab;
}

export function useEditorTabContext<T extends EditorTab>(): T {
  const editorTabContext = useContext(EditorTabContext);

  if (editorTabContext === undefined) {
    throw new Error(
      "useEditorTabContext can only be used in a EditorTabProvider tree",
    );
  }

  return editorTabContext as T;
}
