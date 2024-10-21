import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { ConfigEditingConnection } from "./config-editing-connection";
import { ConfigPipelinePanel } from "./config-pipeline/config-pipeline-panel";

interface ConfigPanelsProps {
  className?: string;
}

export function ConfigPanels({ className }: ConfigPanelsProps): JSX.Element {
  const [panels, setPanels] = useState<string[]>(["config-pipeline"]);

  const shouldFullyExpand = (value: string): boolean => panels.includes(value);

  return (
    <Accordion
      className={cn(className, "tw-flex tw-flex-col tw-justify-start tw-pb-2")}
      onValueChange={(value) => {
        setPanels(value);
      }}
      type="multiple"
      value={panels}
    >
      <PanelItem
        shouldFullyExpand={shouldFullyExpand}
        title="Pipeline"
        value="config-pipeline"
      >
        <ConfigPipelinePanel />
      </PanelItem>

      <PanelItem
        shouldFullyExpand={shouldFullyExpand}
        title="Data Objects"
        value="config-data-objects"
      >
        <h2>Data Objects</h2>
      </PanelItem>

      <PanelItem
        shouldFullyExpand={shouldFullyExpand}
        title="Editing Connection"
        value="config-editing-connection"
      >
        <ConfigEditingConnection />
      </PanelItem>

      <PanelItem
        shouldFullyExpand={shouldFullyExpand}
        title="Canvas Elements"
        value="config-canvas"
      >
        <h2>Canvas Elements</h2>
      </PanelItem>
    </Accordion>
  );
}

interface PanelItemProps {
  value: string;
  title: string;
  shouldFullyExpand: (value: string) => boolean;
  children: React.ReactNode;
}

function PanelItem({
  value,
  title,
  shouldFullyExpand,
  children,
}: PanelItemProps): JSX.Element {
  const shouldExpand = shouldFullyExpand(value);

  return (
    <AccordionItem
      className={cn(
        shouldExpand && "tw-flex-auto",
        "tw-flex tw-flex-col tw-border-ring/20",
      )}
      value={value}
    >
      <AccordionTrigger className="tw-px-2 tw-py-2 hover:tw-no-underline tw-text-sm tw-font-bold tw-bg-gradient-to-bl tw-from-ring/5 tw-bg-muted/20">
        {title}
      </AccordionTrigger>

      <div className="tw-flex-auto tw-h-0 tw-overflow-auto">
        <AccordionContent
          className="tw-px-2 tw-py-2"
          forceMount
          hidden={!shouldExpand}
        >
          {children}
        </AccordionContent>
      </div>
    </AccordionItem>
  );
}
