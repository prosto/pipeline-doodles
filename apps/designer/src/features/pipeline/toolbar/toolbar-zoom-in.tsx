import { ZoomIn } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarZoomIn(): JSX.Element {
  const zoomInAction = useCanvasAction("zoomIn");
  const zoomInSnap = useSnapshot(zoomInAction);

  return (
    <ToolbarButtonWithTooltip
      Icon={ZoomIn}
      disabled={!zoomInSnap.enabled}
      onClick={() => {
        zoomInAction.run();
      }}
      text="Zoom In"
    />
  );
}
