import type { EditorTab } from "@/features/editor/store";
import type { Pipeline } from "@/features/pipeline/store";
import { Separator } from "@repo/ui/components";

import { PipelinePanels } from "./pipeline-panels";
import { PipelinePanelsProvider } from "./providers/panels-provider";
import { PipelineStateProvider } from "./providers/pipeline-provider";
import { PipelineToolbar } from "./toolbar";

interface PipelineEditorProps {
  editorTab: EditorTab<Pipeline>;
}

export function PipelineEditor({
  editorTab,
}: PipelineEditorProps): JSX.Element {
  return (
    <PipelineStateProvider pipeline={editorTab.data}>
      <PipelinePanelsProvider>
        <div className="tw-h-full tw-flex tw-flex-col tw-justify-start">
          <PipelineToolbar className="tw-px-1 tw-py-1" />
          <Separator />
          <PipelinePanels className="tw-flex-grow" />
        </div>
      </PipelinePanelsProvider>
    </PipelineStateProvider>
  );
}
