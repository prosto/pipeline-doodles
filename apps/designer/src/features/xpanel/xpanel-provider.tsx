"use client";

import type { ReactNode } from "react";
import { useRef, createContext, useContext } from "react";

import type { XPanel, XPanelGroup } from "./types";

const XPanelGroupContext = createContext<XPanelGroup | undefined>(undefined);

interface XPanelGroupProviderProps {
  group: XPanelGroup;
  children: ReactNode;
}

export function XPanelGroupProvider({
  children,
  group,
}: XPanelGroupProviderProps): JSX.Element {
  const state = useRef(group).current;

  return (
    <XPanelGroupContext.Provider value={state}>
      {children}
    </XPanelGroupContext.Provider>
  );
}

export function useXPanelGroupContext(): XPanelGroup {
  const panelGroup = useContext(XPanelGroupContext);

  if (panelGroup === undefined) {
    throw new Error(
      "useXPanelGroupContext can only be used in a XPanelGroupContext tree",
    );
  }

  return panelGroup;
}

export function useXPanelGroupState(): XPanelGroup["state"] {
  const panelGroup = useXPanelGroupContext();
  return panelGroup.state;
}

export function useXPanels(...names: string[]): XPanel[] {
  const {
    actions: { getPanel, registerPanel },
  } = useXPanelGroupContext();

  return names
    .map((name) => getPanel(name) || registerPanel(name))
    .filter((panel): panel is XPanel => Boolean(panel));
}

export function useXPanel(name: string): XPanel {
  const [panel] = useXPanels(name);
  return panel;
}
