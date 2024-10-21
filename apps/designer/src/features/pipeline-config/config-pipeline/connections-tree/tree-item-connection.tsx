import { BoxSelect, MoveRight } from "lucide-react";

import type { TreeItemConnectionData } from "@/features/pipeline-config/store/panels/types";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";

import { useTreeItemContext } from "../providers";
import { TreeItemInteractive } from "../shared/tree-item-interactive";

export function TreeItemConnection(): JSX.Element {
  const {
    item: {
      data: { connection },
    },
    children,
    arrow,
  } = useTreeItemContext<TreeItemConnectionData>();

  const { sourceSocket, targetSocket } = connection.state;

  function onSelectElements(): void {
    connection.actions.selectElements();
  }

  return (
    <>
      <TreeItemInteractive>
        {arrow}

        <span className="tw-ml-1 tw-text-muted-foreground">
          {sourceSocket.nodeName}:
        </span>
        <span className="tw-mr-2">{sourceSocket.name}</span>
        <MoveRight className="tw-h-3 tw-w-3" />
        <span className="tw-ml-1 tw-text-muted-foreground">
          {targetSocket.nodeName}:
        </span>
        <span>{targetSocket.name}</span>

        <div className="tw-ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="tw-text-muted-foreground/60"
                onClick={(evn) => {
                  evn.stopPropagation();
                  onSelectElements();
                }}
                size="sm"
                variant="ghost"
              >
                <BoxSelect className="tw-h-4 tw-w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Select in Canvas</TooltipContent>
          </Tooltip>
        </div>
      </TreeItemInteractive>

      {children}
    </>
  );
}
