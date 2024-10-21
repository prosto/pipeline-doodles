import { Undo } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarUndo(): JSX.Element {
  const undoAction = useCanvasAction("undo");
  const undoActionSnap = useSnapshot(undoAction);

  return (
    <ToolbarButtonWithTooltip
      Icon={Undo}
      disabled={!undoActionSnap.enabled}
      onClick={() => {
        undoAction.run();
      }}
      text="Undo"
    />
  );
}
