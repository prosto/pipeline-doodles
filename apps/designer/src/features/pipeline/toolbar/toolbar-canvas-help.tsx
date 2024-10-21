import { HelpCircle } from "lucide-react";

import { DropdownMenuItem, DropdownMenuShortcut } from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

export function ToolbarCanvasHelp(): JSX.Element {
  const toggleShortcutsAction = useCanvasAction("toggleShortcuts");

  return (
    <DropdownMenuItem
      onClick={() => {
        toggleShortcutsAction.run();
      }}
    >
      <HelpCircle className="tw-mr-2 tw-h-4 tw-w-4" />
      <span className="tw-mr-2">Help</span>
      <DropdownMenuShortcut>?</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
