import { getId } from "@repo/shared/utils";
import { proxy } from "valtio";
import { proxyMap } from "valtio/utils";

import type { XPanel, XPanelGroup } from "./types";

export function xPanelFactory(
  panelProps: Partial<XPanel["state"]> = {},
): XPanel {
  const id = getId();

  const state = proxy({
    id,
    isCollapsed: true,
    ...panelProps,
  });
  const actions = {
    collapse() {
      state.isCollapsed = true;
    },
    expand() {
      state.isCollapsed = false;
    },
    toggle() {
      state.isCollapsed = !state.isCollapsed;
    },
  };

  return {
    state,
    actions,
  };
}

type InitialPanels = Record<string, Omit<XPanel["state"], "id">>;

export function xPanelGroupFactory(
  initialPanels: InitialPanels = {},
): XPanelGroup {
  const panels = proxyMap<string, XPanel>();

  for (const [name, initialPanelState] of Object.entries(initialPanels)) {
    panels.set(name, xPanelFactory(initialPanelState));
  }

  const state = proxy({
    panels,
    get panelList(): XPanel[] {
      return Array.from(panels.values());
    },
    get panelNames(): string[] {
      return Array.from(panels.keys());
    },
  });

  const actions = {
    getPanel(name: string): XPanel | undefined {
      return state.panels.get(name);
    },
    registerPanel(name: string) {
      const newPanel = xPanelFactory();
      state.panels.set(name, newPanel);

      return newPanel;
    },
  };

  return {
    state,
    actions,
  };
}
