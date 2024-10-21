import { useRef, useState } from "react";

import { Sidebar } from "@/features/explorer";
import type { ImperativePanelHandle } from "@repo/ui/components";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { Editor } from "../features/editor/editor";

export function DesignerAppPanels(): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sideBarPanelRef = useRef<ImperativePanelHandle>(null);
  const [_, setDesignerLayout] = useState<number[]>([]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      id="app-panel-group"
      onLayout={(sizes: number[]) => {
        setDesignerLayout(sizes);
      }}
    >
      <ResizablePanel
        className={cn(
          isCollapsed &&
            "tw-min-w-[50px] tw-transition-all tw-duration-300 tw-ease-in-out",
        )}
        collapsedSize={0}
        collapsible
        defaultSize={20}
        maxSize={30}
        minSize={10}
        onCollapse={() => {
          setIsCollapsed(true);
        }}
        onExpand={() => {
          setIsCollapsed(false);
        }}
        ref={sideBarPanelRef}
      >
        <Sidebar
          className="tw-h-full"
          isCollapsed={isCollapsed}
          onTabActivated={() => sideBarPanelRef.current?.expand()}
          onTabDeactivated={() => sideBarPanelRef.current?.collapse()}
        />
      </ResizablePanel>
      <ResizableHandle
        className={cn("tw-bg-secondary", isCollapsed && "tw-bg-secondary/70")}
        style={{ width: isCollapsed ? "3px" : "5px" }}
        withHandle
      />
      <ResizablePanel defaultSize={80}>
        <Editor className="tw-h-full" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
