import { FileJson } from "lucide-react";
import { useCallback } from "react";

import { useEditorActions } from "@/features/editor/hooks";
import { pipelineJsonEditorTab } from "@/features/editor/store/editor-tab";
import { ToolbarButtonWithTooltip } from "@/features/ui";
import { DropdownMenuItem } from "@repo/ui/components";

import { usePipelineGraph } from "../hooks/use-pipeline-graph";
import { usePipelineMarshaller } from "../hooks/use-pipeline-marshaller";

export function ToolbarPipelineMarshall(): JSX.Element {
  const { onMarshal } = useMarshalCallback();

  return (
    <ToolbarButtonWithTooltip
      Icon={FileJson}
      onClick={onMarshal}
      text="Open Definition"
    />
  );
}

export function ToolbarButtonPipelineMarshall(): JSX.Element {
  const { onMarshal } = useMarshalCallback();
  return (
    <DropdownMenuItem onClick={onMarshal}>
      <FileJson className="tw-mr-2 tw-h-4 tw-w-4" />
      <span>Open Definition</span>
    </DropdownMenuItem>
  );
}

function useMarshalCallback(): {
  onMarshal: () => void;
} {
  const { addEditorTab } = useEditorActions();
  const {
    state: { id: graphId },
  } = usePipelineGraph();
  const { marshal } = usePipelineMarshaller();

  const onMarshal = useCallback(() => {
    async function marshalPipeline(): Promise<void> {
      const jsonData = await marshal();
      addEditorTab(
        pipelineJsonEditorTab(jsonData, "yaml", {
          id: graphId,
        }),
      );
    }

    void marshalPipeline();
  }, [marshal, addEditorTab, graphId]);

  return { onMarshal };
}
