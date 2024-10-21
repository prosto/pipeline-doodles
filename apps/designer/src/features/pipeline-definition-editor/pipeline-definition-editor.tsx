import type { PipelineJsonEditorTab } from "@/features/editor/store";
import { Separator } from "@repo/ui/components";

import { PipelineDefEditorCode } from "./editor-code";
import { EditorStoreProvider } from "./editor-store-provider";
import { PipelineDefEditorToolbar } from "./editor-toolbar";

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  editorTab: PipelineJsonEditorTab;
}

export function PipelineDefinitionEditor({
  editorTab,
}: EditorProps): JSX.Element {
  return (
    <EditorStoreProvider editorTab={editorTab}>
      <div className="tw-h-full tw-flex tw-flex-col tw-justify-start">
        <PipelineDefEditorToolbar className="tw-px-1 tw-py-1" />

        <Separator />

        <div className="tw-flex-auto tw-h-0 tw-overflow-auto">
          <PipelineDefEditorCode className="tw-h-full" />
        </div>
      </div>
    </EditorStoreProvider>
  );
}
