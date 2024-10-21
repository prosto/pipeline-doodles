import { Download } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";
import { DropdownMenuItem } from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarCanvasSave(): JSX.Element {
  const jsonExportAction = useCanvasAction("jsonExport");
  const jsonExportSnap = useSnapshot(jsonExportAction);

  return (
    <DropdownMenuItem
      disabled={!jsonExportSnap.enabled}
      onClick={() => {
        jsonExportAction.run();
      }}
    >
      <Download className="tw-mr-2 tw-h-4 tw-w-4" />
      <span>Save to...</span>
    </DropdownMenuItem>
  );
}

export function ToolbarButtonCanvasSave(): JSX.Element {
  const jsonExportAction = useCanvasAction("jsonExport");
  const jsonExportSnap = useSnapshot(jsonExportAction);

  return (
    <ToolbarButtonWithTooltip
      Icon={Download}
      disabled={!jsonExportSnap.enabled}
      onClick={() => {
        jsonExportAction.run();
      }}
      text="Save to..."
    />
  );
}
