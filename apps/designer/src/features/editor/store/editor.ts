import { assertIsDefined } from "@repo/shared/utils";
import { proxy } from "valtio";
import { proxyMap } from "valtio/utils";

import { defaultTabFactory } from "./editor-tab";
import { editorViewFactory } from "./editor-view";
import type { Editor, EditorTab, EditorView } from "./types";

const editorState = (): Editor["state"] => {
  const editorView = editorViewFactory();

  const views: Map<string, EditorView> = proxyMap();
  views.set(editorView.id, editorView);

  const editor = proxy<Editor["state"]>({
    views,
    activeViewId: editorView.id,
    get viewsList(): EditorView[] {
      return Array.from(editor.views.values());
    },
    get firstView(): EditorView {
      return editor.viewsList[0];
    },
    get lastView(): EditorView {
      return editor.viewsList[editor.viewsList.length - 1];
    },
    get activeView(): EditorView | undefined {
      return editor.viewsList.find((view) => view.id === editor.activeViewId);
    },
  });

  return editor;
};

const editorActions = (editor: Editor["state"]): Editor["actions"] => {
  function getViewById(id: string): EditorView | undefined {
    return editor.views.get(id);
  }

  function setActiveTab(viewId: string, tabId: string): void {
    const editorView = getViewById(viewId);

    if (editorView) {
      editorView.activeTabId = tabId;
    }
  }

  function addEditorTab(tab: EditorTab): EditorTab {
    const activeView = editor.activeView;

    if (activeView) {
      if (!activeView.getTabById(tab.id)) {
        activeView.tabs.push(tab);
      }
      activeView.activeTabId = tab.id;
    }

    return tab;
  }

  function addDefaultEditorTab(viewId: string, isActive = false): EditorTab {
    const editorView = getViewById(viewId);
    assertIsDefined(editorView);

    const activeTab = editorView.activeTab;
    const newTab = defaultTabFactory.create();

    if (isActive && activeTab) {
      editorView.activeTabId = newTab.id;
    }

    editorView.tabs.push(newTab);

    return newTab;
  }

  function splitView(): void {
    const editorView = editorViewFactory();
    editor.views.set(editorView.id, editorView);
  }

  function closeView(viewId: string): void {
    const views = editor.views;
    if (views.size <= 1) {
      return;
    }
    if (views.delete(viewId)) {
      const newActiveView: EditorView = Array.from(views.values())[0];
      editor.activeViewId = newActiveView.id;
    }
  }

  function closeTab(viewId: string, tabId: string): void {
    const editorView = getViewById(viewId);

    if (!editorView) {
      return;
    }

    const tabs = editorView.tabs;

    const index = tabs.findIndex((tab) => tab.id === tabId);
    if (index >= 0) {
      editorView.activeTabId = tabs[tabs.length - 1].id;
      editorView.tabs.splice(index, 1);
    }

    if (tabs.length === 0) {
      closeView(editorView.id);
    } else {
      editorView.activeTabId = editorView.tabs[editorView.tabs.length - 1].id;
    }
  }

  function getTabFromView(
    viewId: string,
    tabId: string,
  ): EditorTab | undefined {
    return getViewById(viewId)?.getTabById(tabId);
  }

  function setActiveView(viewId: string): void {
    const editorView = getViewById(viewId);
    const activeView = editor.activeView;

    if (editorView && viewId !== editor.activeViewId) {
      if (activeView) {
        activeView.isActive = false;
      }
      editorView.isActive = true;
      editor.activeViewId = viewId;
    }
  }

  return {
    getViewById,
    setActiveTab,
    addEditorTab,
    addDefaultEditorTab,
    splitView,
    closeView,
    closeTab,
    getTabFromView,
    setActiveView,
  };
};

export function editorFactory(): Editor {
  const state = editorState();
  const actions = editorActions(state);

  return {
    state,
    actions,
  };
}
