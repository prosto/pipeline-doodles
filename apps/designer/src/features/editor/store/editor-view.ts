import { nanoid } from "nanoid";
import { proxy } from "valtio";

import { defaultTabFactory } from "./editor-tab";
import type { EditorTab, EditorView } from "./types";

export function editorViewFactory(): EditorView {
  const id = nanoid();

  const defaultTab = defaultTabFactory.create();

  const editorView = proxy<EditorView>({
    id,
    isActive: true,
    tabs: [defaultTab],
    activeTabId: defaultTab.id,

    get activeTab(): EditorTab | undefined {
      return editorView.tabs.find((tab) => tab.id === editorView.activeTabId);
    },

    getTabById: (tabId: string): EditorTab | undefined => {
      return editorView.tabs.find((tab) => tab.id === tabId);
    },
  });

  return editorView;
}
