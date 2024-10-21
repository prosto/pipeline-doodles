import { PipelineConfigTabs } from "@/features/pipeline-config";
import { XPanelComponent, XPanelGroupComponent } from "@/features/xpanel";
import { ResizableHandle } from "@repo/ui/components";

import { PipelineCanvas } from "./canvas";
import { PipelineInspector } from "./inspector";

type PipelinePanelsProps = React.HTMLAttributes<HTMLDivElement>;

export function PipelinePanels({
  className,
}: PipelinePanelsProps): JSX.Element {
  const panelGroup1 = ["flow-and-params", "inspector"];
  const [flowAndParams, inspector] = panelGroup1;

  const panelGroup2 = ["flow", "params"];
  const [flowPanelName, paramsPanelName] = panelGroup2;

  return (
    <XPanelGroupComponent
      className={className}
      direction="vertical"
      panelNames={panelGroup1}
    >
      <XPanelComponent
        collapsible
        defaultSize={100}
        name={flowAndParams}
        order={1}
      >
        <XPanelGroupComponent direction="horizontal" panelNames={panelGroup2}>
          <XPanelComponent
            collapsible
            defaultSize={70}
            name={flowPanelName}
            order={1}
          >
            <PipelineCanvas className="tw-h-full tw-w-full" />
          </XPanelComponent>

          <ResizableHandle />

          <XPanelComponent
            collapsible
            defaultSize={30}
            minSize={10}
            name={paramsPanelName}
            order={2}
          >
            <PipelineConfigTabs className="tw-h-full tw-w-full" />
          </XPanelComponent>
        </XPanelGroupComponent>
      </XPanelComponent>

      <ResizableHandle />

      <XPanelComponent
        collapsible
        defaultRestoredSize={33}
        defaultSize={0}
        minSize={15}
        name={inspector}
        order={2}
      >
        <PipelineInspector />
      </XPanelComponent>
    </XPanelGroupComponent>
  );
}
