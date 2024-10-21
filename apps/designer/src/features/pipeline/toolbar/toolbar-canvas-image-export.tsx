import { ImageDown } from "lucide-react";

import { DropdownMenuItem, DropdownMenuShortcut } from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarCanvasImageExport(): JSX.Element {
  const imageExportAction = useCanvasAction("imageExport");

  return (
    <DropdownMenuItem
      onClick={() => {
        imageExportAction.run();
      }}
    >
      <ImageDown className="tw-mr-2 tw-h-4 tw-w-4" />
      <span className="tw-mr-2">Export image...</span>
      <DropdownMenuShortcut>Cmd+Shift+E</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
