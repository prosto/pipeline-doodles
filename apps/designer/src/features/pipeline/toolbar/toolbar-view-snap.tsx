import { useSnapshot } from "valtio";

import {
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarViewSnap(): JSX.Element {
  const snapModeAction = useCanvasAction("objectsSnapMode");
  const snapModeSnap = useSnapshot(snapModeAction);

  return (
    <DropdownMenuCheckboxItem
      checked={snapModeSnap.checked}
      disabled={!snapModeSnap.enabled}
      onClick={() => {
        snapModeAction.run();
      }}
    >
      <span>Snap to objects</span>
      <DropdownMenuShortcut>Options+S</DropdownMenuShortcut>
    </DropdownMenuCheckboxItem>
  );
}
