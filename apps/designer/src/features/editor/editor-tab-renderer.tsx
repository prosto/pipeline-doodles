import { DefaultEditor } from "./editor-default";
import { useEditorTab } from "./hooks";
import { getEditorComponent } from "./store";

interface EditorTabRendererProps {
  viewId: string;
  tabId: string;
}

export function EditorTabRenderer({
  viewId,
  tabId,
}: EditorTabRendererProps): JSX.Element {
  const editorTab = useEditorTab(viewId, tabId);

  const EditorComponent = getEditorComponent(editorTab.type) ?? DefaultEditor;

  return <EditorComponent editorTab={editorTab} />;
}
