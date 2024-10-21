import type { HTMLAttributes } from "react";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { ConfigPanels } from "./config-panels";
import { PipelineConfigTabsToolbar } from "./config-tabs-toolbar";

type PipelineConfigTabsProps = HTMLAttributes<HTMLDivElement>;

export function PipelineConfigTabs({
  className,
}: PipelineConfigTabsProps): JSX.Element {
  return (
    <Tabs
      activationMode="automatic"
      className={cn("tw-flex tw-flex-col", className)}
      data-area="pipeline-config-tabs"
      defaultValue="config-view-canvas"
    >
      <div className="tw-flex tw-justify-start tw-items-center tw-bg-muted/100 tw-text-muted-foreground">
        <TabsList className="tw-mr-auto tw-bg-inherit">
          <PipelineConfigTabsToolbar />
          <TabsTrigger value="config-view-canvas">
            <span>Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="config-view-selected">
            <span>Chat</span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        className="tw-flex-grow tw-flex tw-mt-0 tw-mb-2"
        value="config-view-canvas"
      >
        <ConfigPanels className="tw-flex-grow" />
      </TabsContent>
      <TabsContent className="tw-flex-grow" value="config-view-selected">
        <h1>Chat Component Here?</h1>
      </TabsContent>
    </Tabs>
  );
}

export default PipelineConfigTabs;
