import { PanelRightClose } from "lucide-react";

import { ToolbarButtonWithTooltip } from "@/features/ui";
import { useXPanel } from "@/features/xpanel";
import { cn } from "@repo/ui/utils";

type PipelineConfigTabsToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export function PipelineConfigTabsToolbar({
  className,
}: PipelineConfigTabsToolbarProps): JSX.Element {
  const { actions: paramsPanelActions } = useXPanel("params");

  return (
    <div
      className={cn(
        "tw-bg-muted tw-h-10 tw-flex tw-justify-start tw-items-center",
        className,
      )}
    >
      <ToolbarButtonWithTooltip
        Icon={PanelRightClose}
        onClick={(event) => {
          event.stopPropagation();
          paramsPanelActions.collapse();
        }}
        text="Hide Panel"
      />
    </div>
  );
}
