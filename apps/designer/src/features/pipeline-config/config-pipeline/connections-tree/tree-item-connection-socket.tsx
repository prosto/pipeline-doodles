import { ExternalLink } from "lucide-react";

import type { TreeItemConnectionSocketData } from "@/features/pipeline-config/store/panels/types";
import type { ConnectionSocket } from "@/features/pipeline-graph/types";
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";

import { usePipelineConfig } from "../../hooks/use-config";
import { useTreeItemContext } from "../providers";
import { TreeItemInteractive } from "../shared/tree-item-interactive";

export function TreeItemConnectionSocket(): JSX.Element {
  const {
    item: {
      data: { socket },
    },
    arrow,
  } = useTreeItemContext<TreeItemConnectionSocketData>();

  const pipelineConfig = usePipelineConfig();
  const { pipeline: pipelinePanel } = pipelineConfig.state.panels;

  function onSelectSocket({ nodeId }: ConnectionSocket): void {
    const treeRef = pipelinePanel.components.treeRef;
    if (treeRef) {
      treeRef.selectItems([nodeId]);
      treeRef.focusItem(nodeId);
    }
  }

  return (
    <TreeItemInteractive>
      {arrow}

      <Badge className="tw-ml-1 tw-mr-2" variant="secondary">
        {socket.type === "output" ? "sender" : "receiver"}
      </Badge>
      <span className="tw-text-muted-foreground">{socket.nodeName}:</span>
      <span className="tw-mr-2">{socket.name}</span>

      <div className="tw-ml-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="tw-text-muted-foreground/60"
              onClick={(evn) => {
                evn.stopPropagation();
                onSelectSocket(socket);
              }}
              size="sm"
              variant="ghost"
            >
              <ExternalLink className="tw-h-4 tw-w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Focus Component</TooltipContent>
        </Tooltip>
      </div>
    </TreeItemInteractive>
  );
}
