import { Trash2 } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButtonWithTooltip } from "@/features/ui";
import { DialogMenuItem } from "@/features/ui/dialog-menu-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components";

import { useCanvasAction } from "../hooks/use-canvas-actions";

interface ToolbarCanvasResetProps {
  handleDialogItemSelect: () => void;
  handleDialogItemOpenChange: (open: boolean) => void;
}

export function ToolbarCanvasReset({
  handleDialogItemSelect,
  handleDialogItemOpenChange,
}: ToolbarCanvasResetProps): JSX.Element {
  const clearCanvasAction = useCanvasAction("clearCanvas");
  const clearCanvasActionSnap = useSnapshot(clearCanvasAction);

  return (
    <DialogMenuItem
      disabled={!clearCanvasActionSnap.enabled}
      onOpenChange={handleDialogItemOpenChange}
      onSelect={handleDialogItemSelect}
      triggerChildren={
        <>
          <Trash2 className="tw-mr-2 tw-h-4 tw-w-4" />
          <span className="tw-mr-2">Reset the canvas</span>
        </>
      }
    >
      <ClearCanvasDialogContent
        dialogAction={() => {
          clearCanvasAction.run();
        }}
      />
    </DialogMenuItem>
  );
}

export function ToolbarButtonCanvasReset(): JSX.Element {
  const clearCanvasAction = useCanvasAction("clearCanvas");
  const clearCanvasActionSnap = useSnapshot(clearCanvasAction);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <ToolbarButtonWithTooltip
          Icon={Trash2}
          disabled={!clearCanvasActionSnap.enabled}
          text="Reset the canvas"
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <ClearCanvasDialogContent
          dialogAction={() => {
            clearCanvasAction.run();
          }}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ClearCanvasDialogContent({
  dialogAction,
}: {
  dialogAction: () => void;
}): JSX.Element {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Clear canvas</AlertDialogTitle>
        <AlertDialogDescription>
          This will clear the whole canvas. Are you sure?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={dialogAction}>Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
