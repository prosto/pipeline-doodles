import { BoxSelect } from "lucide-react";

import type { TreeItemDocumentStoreData } from "@/features/pipeline-config/store/panels/types";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";

import { useTreeItemContext } from "../providers";
import { TreeItemInteractive } from "../shared/tree-item-interactive";

export function DocumentStoreTreeItem(): JSX.Element {
  const {
    children,
    item: {
      data: { documentStore },
    },
    arrow,
  } = useTreeItemContext<TreeItemDocumentStoreData>();

  const state = documentStore.state.documentStore.state;

  function onSelectElements(): void {
    // TODO: Not Implemented
  }

  return (
    <>
      <TreeItemInteractive>
        {arrow}

        <span className="tw-ml-1 tw-mr-3">{state.name}</span>
        <span className="tw-text-xs tw-font-mono tw-text-muted-foreground">
          [{state.schema.__pyType}]
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
