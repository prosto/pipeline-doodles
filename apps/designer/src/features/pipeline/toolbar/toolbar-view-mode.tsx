import { useSnapshot } from "valtio";

import {
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarViewMode(): JSX.Element {
  const viewModeAction = useCanvasAction("viewMode");
  const viewModeSnap = useSnapshot(viewModeAction);

  return (
    <DropdownMenuCheckboxItem
      checked={viewModeSnap.checked}
      disabled={!viewModeSnap.enabled}
      onClick={() => {
        viewModeAction.run();
      }}
    >
      <span>View mode</span>
      <DropdownMenuShortcut>Options+R</DropdownMenuShortcut>
    </DropdownMenuCheckboxItem>
  );
}
