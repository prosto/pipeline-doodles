import { BoxSelect } from "lucide-react";

import { useCanvasElements } from "@/features/pipeline/hooks/use-canvas";
import type { TreeItemElementData } from "@/features/pipeline-config/store/panels/types";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";

import { useTreeItemContext } from "../providers";

import { TreeItemInteractive } from "./tree-item-interactive";

export function TreeItemElement(): JSX.Element {
  const {
    item: {
      data: { element },
    },
    arrow,
  } = useTreeItemContext<TreeItemElementData>();

  const {
    actions: { selectElements },
  } = useCanvasElements();

  return (
    <TreeItemInteractive>
      {arrow}

      <span className="tw-ml-1 tw-mr-3 tw-text-muted-foreground tw-font-semibold">
        {element.type}
      </span>
      <span className="tw-text-xs tw-font-mono tw-text-muted-foreground">
        [id: {element.id}]
      </span>

      <div className="tw-ml-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="tw-text-muted-foreground/60"
              onClick={(evn) => {
                evn.stopPropagation();
                selectElements([element]);
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
  );
}
