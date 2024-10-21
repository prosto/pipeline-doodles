import { useSnapshot } from "valtio";

import {
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarViewShowGrid(): JSX.Element {
  const gridModeAction = useCanvasAction("gridMode");
  const gridModeSnap = useSnapshot(gridModeAction);

  return (
    <DropdownMenuCheckboxItem
      checked={gridModeSnap.checked}
      onClick={() => {
        gridModeAction.run();
      }}
    >
      <span>Show grid</span>
      <DropdownMenuShortcut>Cmd+&apos;</DropdownMenuShortcut>
    </DropdownMenuCheckboxItem>
  );
}
