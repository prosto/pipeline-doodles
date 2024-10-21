import { FolderOpen } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";
import { DropdownMenuItem, DropdownMenuShortcut } from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarCanvasOpen(): JSX.Element {
  const loadSceneAction = useCanvasAction("loadScene");
  const loadSceneSnap = useSnapshot(loadSceneAction);

  return (
    <DropdownMenuItem
      disabled={!loadSceneSnap.enabled}
      onClick={() => {
        loadSceneAction.run();
      }}
    >
      <FolderOpen className="tw-mr-2 tw-h-4 tw-w-4" />
      <span>Open</span>
      <DropdownMenuShortcut>Cmd+O</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

export function ToolbarButtonCanvasOpen(): JSX.Element {
  const loadSceneAction = useCanvasAction("loadScene");
  const loadSceneSnap = useSnapshot(loadSceneAction);

  return (
    <ToolbarButtonWithTooltip
      Icon={FolderOpen}
      disabled={!loadSceneSnap.enabled}
      onClick={() => {
        loadSceneAction.run();
      }}
      text="Open..."
    />
  );
}
