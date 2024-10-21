import { BoxSelect } from "lucide-react";

import type { TreeItemComponentData } from "@/features/pipeline-config/store/panels/types";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";

import { useTreeItemContext } from "../providers";
import { TreeItemInteractive } from "../shared/tree-item-interactive";

export function TreeItemComponent(): JSX.Element {
  const {
    children,
    item: {
      data: { component },
    },
    arrow,
  } = useTreeItemContext<TreeItemComponentData>();

  const state = component.state.node.state;

  function onSelectElements(): void {
    component.actions.selectElements();
  }

  return (
    <>
      <TreeItemInteractive>
        {arrow}

        <span className="tw-ml-1 tw-mr-3">{state.name}</span>

        <span className="tw-text-xs tw-font-mono tw-text-muted-foreground">
          [{state.schemaNode.descriptor.pyType}]
        </span>

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
