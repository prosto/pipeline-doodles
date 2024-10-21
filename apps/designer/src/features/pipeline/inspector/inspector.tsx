"use client";

import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { ProblemsInspector } from "./inspector-problems";
import { PipelineRunsInspector } from "./inspector-runs";
import { InspectorToolbar } from "./inspector-toolbar";

type PipelineInspectorProps = React.HTMLAttributes<HTMLDivElement>;

export function PipelineInspector({
  className,
}: PipelineInspectorProps): JSX.Element {
  return (
    <Tabs
      activationMode="automatic"
      className={cn("tw-flex tw-flex-col", className)}
      defaultValue="inspector-pipeline-runs"
    >
      <div className="tw-flex tw-justify-start tw-items-center tw-bg-muted/100 tw-text-muted-foreground">
        <TabsList className="tw-mr-auto tw-bg-inherit">
          <TabsTrigger value="inspector-pipeline-runs">
            <span>Pipeline Runs</span>
            <Badge className="tw-ml-2" variant="secondary">
              10
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inspector-problems">
            <span>Problems</span>
            <Badge className="tw-ml-2" variant="secondary">
              5
            </Badge>
          </TabsTrigger>
        </TabsList>
        <InspectorToolbar />
      </div>
      <TabsContent className="tw-flex-grow" value="inspector-pipeline-runs">
        <PipelineRunsInspector />
      </TabsContent>
      <TabsContent className="tw-flex-grow" value="inspector-problems">
        <ProblemsInspector />
      </TabsContent>
    </Tabs>
  );
}
