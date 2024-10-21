import { Redo } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarRedo(): JSX.Element {
  const redoAction = useCanvasAction("redo");
  const redoActionSnap = useSnapshot(redoAction);

  return (
    <ToolbarButtonWithTooltip
      Icon={Redo}
      disabled={!redoActionSnap.enabled}
      onClick={() => {
        redoAction.run();
      }}
      text="Redo"
    />
  );
}
