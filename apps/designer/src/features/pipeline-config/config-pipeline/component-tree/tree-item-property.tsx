import { Link2 } from "lucide-react";
import { useSnapshot } from "valtio";

import type { TreeItemComponentPropertyData } from "@/features/pipeline-config/store/panels/types";
import type { ConnectionSocketWithState } from "@/features/pipeline-graph/types";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { useTreeItemContext } from "../providers";
import { TreeItemInteractive } from "../shared/tree-item-interactive";

export function TreeItemComponentProperty(): JSX.Element {
  const {
    item: {
      data: { name, pyType, socket },
    },
    arrow,
  } = useTreeItemContext<TreeItemComponentPropertyData>();
  // const pipelineConfig = usePipelineConfig();
  // const { pipeline: pipelinePanel } = pipelineConfig.state.panels;

  // function onSelectConnection({ nodeId }: ConnectionSocket): void {
  //   pipelinePanel.componentsTreeRef?.selectItems([nodeId]);
  //   pipelinePanel.componentsTreeRef?.focusItem(nodeId);
  // }

  return (
    <TreeItemInteractive>
      {arrow}

      <span
        className={cn(
          "tw-ml-1 tw-mr-3 tw-text-muted-foreground tw-font-semibold",
        )}
      >
        {name}
      </span>

      <span className="tw-text-xs tw-font-mono tw-text-muted-foreground">
        {pyType}
      </span>

      {socket ? <ConnectedSocketsInfo socket={socket} /> : null}
    </TreeItemInteractive>
  );
}

function ConnectedSocketsInfo({
  socket,
}: {
  socket: ConnectionSocketWithState;
}): JSX.Element | null {
  const stateSnap = useSnapshot(socket.connectedState);

  if (!stateSnap.isConnected) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Link2 className="tw-ml-2 tw-w-5 tw-h-5 tw-text-ring/70 hover:tw-text-ring" />
      </PopoverTrigger>
      <PopoverContent className="tw-w-80">Hello</PopoverContent>
    </Popover>
  );
}
