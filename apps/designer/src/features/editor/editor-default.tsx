import type { EditorTab } from "@/features/editor/store";

import { AlertDestructive } from "../ui/alert";

interface EditorComponentProps {
  editorTab: EditorTab;
}

export function DefaultEditor({
  editorTab,
}: EditorComponentProps): JSX.Element {
  return <AlertDestructive message={`${editorTab.title}: Default Editor`} />;
}
