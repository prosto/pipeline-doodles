import type { HTMLAttributes } from "react";
import React from "react";

import { Separator } from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { CollapsiblePanelSection } from "./collapsible-section";
import { ComponentsTree } from "./component-tree";
import { ConfigPipelineParameters } from "./config-pipeline-parameters";
import { ConnectionsTree } from "./connections-tree";
import { DocumentStoreTree } from "./document-store-tree";
import { PipelineInputsEditor } from "./pipeline-inputs-editor";

type ConfigPipelinePanelProps = HTMLAttributes<HTMLDivElement>;

export function ConfigPipelinePanel({
  className,
}: ConfigPipelinePanelProps): JSX.Element {
  return (
    <div className={cn("tw-flex tw-flex-col", className)}>
      <CollapsiblePanelSection initiallyOpen={false} title="Parameters">
        <ConfigPipelineParameters />
      </CollapsiblePanelSection>

      <Separator className="tw-my-2" />

      <CollapsiblePanelSection initiallyOpen={false} title="Inputs">
        <PipelineInputsEditor />
      </CollapsiblePanelSection>

      <Separator className="tw-my-2" />

      <CollapsiblePanelSection title="Components">
        <ComponentsTree />
      </CollapsiblePanelSection>

      <Separator className="tw-my-2" />

      <CollapsiblePanelSection title="Connections">
        <ConnectionsTree />
      </CollapsiblePanelSection>

      <Separator className="tw-my-2" />

      <CollapsiblePanelSection title="Document Stores">
        <DocumentStoreTree />
      </CollapsiblePanelSection>
    </div>
  );
}
