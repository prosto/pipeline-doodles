import type { PropsWithChildren } from "react";

import { XPanelGroupProvider, xPanelGroupFactory } from "@/features/xpanel";
import { useSingleton } from "@repo/ui/hooks";

export function PipelinePanelsProvider({
  children,
}: PropsWithChildren): JSX.Element {
  // Creating initial panels, once per provider
  const panelGroup = useSingleton(() => xPanelGroupFactory());

  return (
    <XPanelGroupProvider group={panelGroup}>{children}</XPanelGroupProvider>
  );
}
