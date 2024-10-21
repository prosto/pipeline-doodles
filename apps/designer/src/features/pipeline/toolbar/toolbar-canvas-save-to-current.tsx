import { Save } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";
import { DropdownMenuItem, DropdownMenuShortcut } from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarCanvasSaveToCurrent(): JSX.Element {
  const saveToActiveFileAction = useCanvasAction("saveToActiveFile");
  const saveToActiveFileSnap = useSnapshot(saveToActiveFileAction);

  return (
    <DropdownMenuItem
      disabled={!saveToActiveFileSnap.enabled}
      onClick={() => {
        saveToActiveFileAction.run();
      }}
    >
      <Save className="tw-mr-2 tw-h-4 tw-w-4" />
      <span>Save to current file</span>
      <DropdownMenuShortcut>Cmd+S</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

export function ToolbarButtonCanvasSaveToCurrent(): JSX.Element {
  const saveToActiveFileAction = useCanvasAction("saveToActiveFile");
  const saveToActiveFileSnap = useSnapshot(saveToActiveFileAction);

  return (
    <ToolbarButtonWithTooltip
      Icon={Save}
      disabled={!saveToActiveFileSnap.enabled}
      onClick={() => {
        saveToActiveFileAction.run();
      }}
      text="Save to current file"
    />
  );
}
