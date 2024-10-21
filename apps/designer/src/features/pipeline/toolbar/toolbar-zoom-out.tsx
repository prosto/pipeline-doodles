import { ZoomOut } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarZoomOut(): JSX.Element {
  const zoomOutAction = useCanvasAction("zoomOut");
  const zoomOutSnap = useSnapshot(zoomOutAction);

  return (
    <ToolbarButtonWithTooltip
      Icon={ZoomOut}
      disabled={!zoomOutSnap.enabled}
      onClick={() => {
        zoomOutAction.run();
      }}
      text="Zoom In"
    />
  );
}
