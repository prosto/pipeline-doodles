export interface XPanel {
  state: {
    readonly id: string;
    size?: number;
    isCollapsed: boolean;
  };
  actions: {
    collapse: () => void;
    expand: () => void;
    toggle: () => void;
  };
}

export interface XPanelGroup {
  state: {
    panels: Map<string, XPanel>;
    readonly panelList: XPanel[];
    readonly panelNames: string[];
  };
  actions: {
    getPanel: (name: string) => XPanel | undefined;
    registerPanel: (name: string) => XPanel;
  };
}
