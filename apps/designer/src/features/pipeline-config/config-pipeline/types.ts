import type { ReactNode } from "react";
import type { TreeItem, TreeItemRenderContext } from "react-complex-tree";

export interface TreeItemProps<T = unknown> {
  item: TreeItem<T>;
  depth: number;
  title: ReactNode;
  arrow: ReactNode;
  context: TreeItemRenderContext;
  children: ReactNode;
}
