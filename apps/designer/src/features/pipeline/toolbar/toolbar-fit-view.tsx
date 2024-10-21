import { ScanSearch } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarFitView(): JSX.Element {
  const actionZoomToFit = useCanvasAction("zoomToFit");
  const actionZoomToFitSnap = useSnapshot(actionZoomToFit);

  return (
    <ToolbarButtonWithTooltip
      Icon={ScanSearch}
      disabled={!actionZoomToFitSnap.enabled}
      onClick={() => {
        actionZoomToFit.run();
      }}
      text="Fit View"
    />
  );
}
