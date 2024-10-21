import type { ReactNode } from "react";

import { Slot } from "@repo/ui/components";

import { useTreeItemRenderProps } from "./hooks";

export function TreeItemInteractiveContainer({
  children,
  className,
  asChild,
}: {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
}): JSX.Element {
  const { context } = useTreeItemRenderProps();
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={className}
      {...context.itemContainerWithoutChildrenProps}
      {...context.interactiveElementProps}
    >
      {children}
    </Comp>
  );
}
