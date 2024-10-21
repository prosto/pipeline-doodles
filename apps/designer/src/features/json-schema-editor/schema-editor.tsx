import { EditorTabProvider } from "@/features/editor/editor-tab-provider";
import type { SchemaEditorTab } from "@/features/editor/store";
import { Separator } from "@repo/ui/components";

import { SchemaEditorCode } from "./schema-editor-code";
import { SchemaEditorToolbar } from "./schema-editor-toolbar";

interface SchemaEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  editorTab: SchemaEditorTab;
}

export function SchemaEditor({ editorTab }: SchemaEditorProps): JSX.Element {
  return (
    <EditorTabProvider editorTab={editorTab}>
      <div className="tw-h-full tw-flex tw-flex-col tw-justify-start">
        <SchemaEditorToolbar className="tw-px-1 tw-py-1" />
        <Separator />
        <div className="tw-flex-auto tw-h-0 tw-overflow-auto">
          <SchemaEditorCode className="tw-h-full" editorTab={editorTab} />
        </div>
      </div>
    </EditorTabProvider>
  );
}
