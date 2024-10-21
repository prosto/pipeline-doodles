"use client";

import { Maximize, Minimize, PanelBottomClose } from "lucide-react";
import { useSnapshot } from "valtio";

import { useXPanel } from "@/features/xpanel";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

type InspectorToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export function InspectorToolbar({
  className,
}: InspectorToolbarProps): JSX.Element {
  const { actions: inspectorPanelActions } = useXPanel("inspector");
  const { state: flowAndConfigPanel, actions: flowAndConfigPanelActions } =
    useXPanel("flow-and-params");

  const flowAndConfigPanelSnap = useSnapshot(flowAndConfigPanel);

  return (
    <div className={className}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(flowAndConfigPanelSnap.isCollapsed && "tw-hidden")}
            onClick={(event) => {
              event.stopPropagation();
              flowAndConfigPanelActions.collapse();
            }}
            size="icon"
            variant="ghost"
          >
            <Maximize className="tw-h-5 tw-w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Maximize Panel</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(!flowAndConfigPanelSnap.isCollapsed && "tw-hidden")}
            onClick={(event) => {
              event.stopPropagation();
              flowAndConfigPanelActions.expand();
            }}
            size="icon"
            variant="ghost"
          >
            <Minimize className="tw-h-5 tw-w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Restore Panel Size</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              inspectorPanelActions.collapse();
            }}
            size="icon"
            variant="ghost"
          >
            <PanelBottomClose className="tw-h-5 tw-w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Hide Panel</TooltipContent>
      </Tooltip>
    </div>
  );
}
