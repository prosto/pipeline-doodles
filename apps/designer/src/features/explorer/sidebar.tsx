import { Component, Settings } from "lucide-react";
import { useCallback, useState } from "react";

import {
  ScrollArea,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { NodesTree } from "./nodes/tree";
import { PresetSelector } from "./presets";

type SidebarProps = {
  isCollapsed: boolean;
  onTabActivated?: (name: string) => void;
  onTabDeactivated?: (name: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({
  isCollapsed,
  onTabActivated,
  onTabDeactivated,
  className,
}: SidebarProps): JSX.Element {
  const [activeTab, setActiveTab] = useState("nodes");
  const [hasChangedValue, setHasChangedValue] = useState(false);

  const deactivateTab = useCallback(
    (name: string) => {
      if (activeTab === name && !hasChangedValue) {
        onTabDeactivated?.(name);
      }
      setHasChangedValue(false);
    },
    [activeTab, hasChangedValue, onTabDeactivated],
  );

  return (
    <Tabs
      activationMode="manual"
      className={cn(className, "tw-flex")}
      onValueChange={(value) => {
        setHasChangedValue(true);
        setActiveTab(value);
        onTabActivated?.(value);
      }}
      orientation="vertical"
      value={isCollapsed ? "unknown" : activeTab}
    >
      <TabsList className="tw-w-[50px] tw-h-full tw-flex tw-flex-col tw-justify-start tw-bg-muted/100 tw-rounded-none tw-p-0">
        <TabsTrigger
          className="tw-mt-2"
          onClick={() => {
            deactivateTab("nodes");
          }}
          value="nodes"
        >
          <Component className="tw-h-6 tw-w-6" />
        </TabsTrigger>
        <TabsTrigger
          className="tw-mt-2"
          onClick={() => {
            deactivateTab("settings");
          }}
          value="settings"
        >
          <Settings className="tw-h-6 tw-w-6" />
        </TabsTrigger>
      </TabsList>
      <TabsContent
        className="tw-grow tw-h-full tw-flex tw-justify-start tw-flex-col"
        value="nodes"
      >
        <PresetSelector className="tw-px-2 tw-mb-2" />
        <Separator />
        <ScrollArea className="tw-flex-grow">
          <NodesTree className="tw-h-full tw-px-2" />
        </ScrollArea>
      </TabsContent>
      <TabsContent className="tw-grow tw-h-full" value="settings">
        Global Settings.
      </TabsContent>
    </Tabs>
  );
}
