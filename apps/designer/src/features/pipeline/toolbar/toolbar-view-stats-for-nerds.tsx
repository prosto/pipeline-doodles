import { useSnapshot } from "valtio";

import {
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarViewStatsForNerds(): JSX.Element {
  const statsAction = useCanvasAction("stats");
  const statsActionSnap = useSnapshot(statsAction);

  return (
    <DropdownMenuCheckboxItem
      checked={statsActionSnap.checked}
      disabled={!statsActionSnap.enabled}
      onClick={() => {
        statsAction.run();
      }}
    >
      <span>Stats for nerds</span>
      <DropdownMenuShortcut>Options+/</DropdownMenuShortcut>
    </DropdownMenuCheckboxItem>
  );
}
