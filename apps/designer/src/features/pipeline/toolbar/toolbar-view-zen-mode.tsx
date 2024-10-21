import { useSnapshot } from "valtio";

import {
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarViewZenMode(): JSX.Element {
  const zenModeAction = useCanvasAction("zenMode");
  const zenModeSnap = useSnapshot(zenModeAction);

  return (
    <DropdownMenuCheckboxItem
      checked={zenModeSnap.checked}
      disabled={!zenModeSnap.enabled}
      onClick={() => {
        zenModeAction.run();
      }}
    >
      <span>Zen mode</span>
      <DropdownMenuShortcut>Options+Z</DropdownMenuShortcut>
    </DropdownMenuCheckboxItem>
  );
}
