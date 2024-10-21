import { PanelBottom, PanelRight, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useSnapshot } from "valtio";

import { ToolbarButton } from "@/features/ui";
import { useXPanel } from "@/features/xpanel";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  Separator,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { ToolbarCanvasHelp } from "./toolbar-canvas-help";
import { ToolbarCanvasImageExport } from "./toolbar-canvas-image-export";
import {
  ToolbarButtonCanvasOpen,
  ToolbarCanvasOpen,
} from "./toolbar-canvas-open";
import {
  ToolbarButtonCanvasReset,
  ToolbarCanvasReset,
} from "./toolbar-canvas-reset";
import {
  ToolbarButtonCanvasSave,
  ToolbarCanvasSave,
} from "./toolbar-canvas-save";
import {
  ToolbarButtonCanvasSaveToCurrent,
  ToolbarCanvasSaveToCurrent,
} from "./toolbar-canvas-save-to-current";
import { ToolbarFitView } from "./toolbar-fit-view";
import {
  ToolbarButtonPipelineMarshall,
  ToolbarPipelineMarshall,
} from "./toolbar-pipeline-marshall";
import { ToolbarRedo } from "./toolbar-redo";
import { ToolbarUndo } from "./toolbar-undo";
import { ToolbarViewMode } from "./toolbar-view-mode";
import { ToolbarViewShowGrid } from "./toolbar-view-show-grid";
import { ToolbarViewSnap } from "./toolbar-view-snap";
import { ToolbarViewStatsForNerds } from "./toolbar-view-stats-for-nerds";
import { ToolbarViewZenMode } from "./toolbar-view-zen-mode";
import { ToolbarZoomIn } from "./toolbar-zoom-in";
import { ToolbarZoomOut } from "./toolbar-zoom-out";

type PipelineToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export function PipelineToolbar({
  className,
}: PipelineToolbarProps): JSX.Element {
  const { state: configPanel, actions: configPanelActions } =
    useXPanel("params");

  const { state: inspectorPanel, actions: inspectorPanelActions } =
    useXPanel("inspector");

  const configPanelSnap = useSnapshot(configPanel);
  const inspectorPanelSnap = useSnapshot(inspectorPanel);

  return (
    <div className={cn("tw-flex tw-items-center", className)}>
      <div className="tw-flex tw-items-center tw-gap-1">
        <ToolbarButton
          Icon={PanelBottom}
          iconClass={
            inspectorPanelSnap.isCollapsed ? "tw-text-inherit" : "tw-text-ring"
          }
          onClick={() => {
            inspectorPanelActions.toggle();
          }}
          text="Inspector"
        />
        <ToolbarButton
          Icon={PanelRight}
          iconClass={
            configPanelSnap.isCollapsed ? "tw-text-inherit" : "tw-text-ring"
          }
          onClick={() => {
            configPanelActions.toggle();
          }}
          text="Input"
        />
        <Separator className="tw-mx-2 tw-h-6" orientation="vertical" />

        <CanvasDropdownMenu />

        <ToolbarButtonCanvasOpen />
        <ToolbarButtonCanvasSaveToCurrent />
        <ToolbarButtonCanvasSave />
        <ToolbarButtonCanvasReset />

        <Separator className="tw-mx-2 tw-h-6" orientation="vertical" />

        <ToolbarUndo />
        <ToolbarRedo />
        <Separator className="tw-mx-2 tw-h-6" orientation="vertical" />
        <ToolbarZoomIn />
        <ToolbarZoomOut />
        <ToolbarFitView />

        <Separator className="tw-mx-2 tw-h-6" orientation="vertical" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton
              Icon={ChevronRight}
              iconBeforeText={false}
              text="Pipeline"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="tw-w-72">
            <DropdownMenuLabel>Pipeline Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <ToolbarButtonPipelineMarshall />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarPipelineMarshall />
      </div>
    </div>
  );
}

function CanvasDropdownMenu(): JSX.Element {
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const focusRef = useRef<HTMLButtonElement | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);

  function handleDialogItemSelect(): void {
    focusRef.current = dropdownTriggerRef.current;
  }

  function handleDialogItemOpenChange(open: boolean): void {
    setHasOpenDialog(open);
    if (!open) {
      setDropdownOpen(false);
    }
  }

  return (
    <DropdownMenu onOpenChange={setDropdownOpen} open={dropdownOpen}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          Icon={ChevronRight}
          iconBeforeText={false}
          ref={dropdownTriggerRef}
          text="Canvas"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="tw-w-72"
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
      >
        <DropdownMenuLabel>Editor Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ToolbarCanvasOpen />
          <ToolbarCanvasSaveToCurrent />
          <ToolbarCanvasSave />
          <ToolbarCanvasImageExport />
          <ToolbarCanvasHelp />
          <ToolbarCanvasReset
            handleDialogItemOpenChange={handleDialogItemOpenChange}
            handleDialogItemSelect={handleDialogItemSelect}
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>View Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ToolbarViewShowGrid />
          <ToolbarViewSnap />
          <ToolbarViewZenMode />
          <ToolbarViewMode />
          <ToolbarViewStatsForNerds />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
