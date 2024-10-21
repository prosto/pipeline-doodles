import type { JSONSchema } from "@repo/json-schema";

export type EditorType = string;

export interface EditorTab<T = unknown> {
  id: string;
  title: string;
  saved: boolean;
  hasChanges: boolean;
  type: EditorType;
  data?: T;
}

interface SchemaEditorTabData {
  schema: JSONSchema | string;
}

export interface SchemaEditorTab extends EditorTab<SchemaEditorTabData> {
  data: SchemaEditorTabData;
}

export interface PipelineJsonEditorTabData {
  json: object;
  mode?: "json" | "yaml";
}

export interface PipelineJsonEditorTab
  extends EditorTab<PipelineJsonEditorTabData> {
  data: PipelineJsonEditorTabData;
}

export interface EditorView {
  id: string;
  isActive: boolean;
  tabs: EditorTab[];
  activeTabId?: EditorTab["id"];
  activeTab?: EditorTab;
  getTabById: (tabId: string) => EditorTab | undefined;
}

export interface EditorState {
  readonly views: Map<string, EditorView>;
  readonly viewsList: EditorView[];
  activeViewId: EditorView["id"];
  readonly activeView?: EditorView;
  readonly firstView: EditorView;
  readonly lastView: EditorView;
}

export interface EditorActions {
  getViewById: (id: string) => EditorView | undefined;
  setActiveTab: (viewId: string, tabId: string) => void;
  addEditorTab: (tab: EditorTab) => EditorTab;
  addDefaultEditorTab: (viewId: string, isActive?: boolean) => EditorTab;
  splitView: () => void;
  closeView: (viewId: string) => void;
  closeTab: (viewId: string, tabId: string) => void;
  getTabFromView: (viewId: string, tabId: string) => EditorTab | undefined;
  setActiveView: (viewId: string) => void;
}

export interface Editor {
  state: EditorState;
  actions: EditorActions;
}
