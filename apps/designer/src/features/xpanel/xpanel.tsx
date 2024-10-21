import { useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { subscribeKey } from "valtio/utils";

import type { ImperativePanelHandle } from "@repo/ui/components";
import { ResizablePanel, ResizablePanelGroup } from "@repo/ui/components";

import { useXPanel, useXPanels } from "./xpanel-provider";

type XPanelGroupProps = { panelNames: string[] } & Parameters<
  typeof ResizablePanelGroup
>[0];

export function XPanelGroupComponent({
  panelNames,
  ...props
}: XPanelGroupProps): JSX.Element {
  const allPanels = useXPanels(...panelNames);

  /**
   * Save layout (panel sizes in a given order) in the state so it could be saved/restored later if needed
   */
  function onLayoutUpdate(layout: number[]): void {
    layout.forEach((value, index) => (allPanels[index].state.size = value));
  }

  return <ResizablePanelGroup onLayout={onLayoutUpdate} {...props} />;
}

type ResizablePanelProps = Parameters<typeof ResizablePanel>[0];
export type XPanelProps = {
  name: string;
  defaultRestoredSize?: number;
} & ResizablePanelProps;

export function XPanelComponent({
  name,
  defaultSize,
  defaultRestoredSize,
  ...props
}: XPanelProps): JSX.Element {
  const { state: xPanel } = useXPanel(name);

  const xPanelSnap = useSnapshot(xPanel);
  const panelRef = useRef<ImperativePanelHandle>(null);

  // We first take size value from store otherwise use default value
  const panelSize = xPanelSnap.size ?? defaultSize;
  const [sizeBeforeCollapse, setSizeBeforeCollapse] = useState(defaultSize);

  useEffect(function initPanelRef() {
    if (panelRef.current) {
      const panelHandle = panelRef.current;
      xPanel.isCollapsed = panelHandle.isCollapsed();

      const unsubscribe = subscribeKey(
        xPanel,
        "isCollapsed",
        (isCollapsed: boolean) => {
          if (isCollapsed && !panelHandle.isCollapsed()) {
            setSizeBeforeCollapse(xPanel.size);
            panelHandle.collapse();
          } else if (!panelHandle.isExpanded()) {
            if (sizeBeforeCollapse === 0 && defaultRestoredSize) {
              panelHandle.resize(defaultRestoredSize);
            } else {
              panelHandle.expand();
            }
          }
        },
      );

      return unsubscribe;
    }
  });

  return <ResizablePanel defaultSize={panelSize} {...props} ref={panelRef} />;
}
