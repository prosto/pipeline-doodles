import type { PropsWithChildren } from "react";

import { TreeItemContextProvider } from "../providers";
import type { TreeItemProps } from "../types";

interface RenderProps {
  props: TreeItemProps;
}

export function TreeItemWithContext({
  children,
  props,
}: PropsWithChildren<RenderProps>): JSX.Element {
  return (
    <TreeItemContextProvider props={props}>{children}</TreeItemContextProvider>
  );
}
