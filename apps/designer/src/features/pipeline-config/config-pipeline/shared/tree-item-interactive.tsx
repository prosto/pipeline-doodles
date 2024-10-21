import type { PropsWithChildren } from "react";

import { buttonVariants } from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { useTreeItemContext } from "../providers";

export function TreeItemInteractive({
  children,
}: PropsWithChildren): JSX.Element {
  const { item, context } = useTreeItemContext();
  return (
    <div
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "tw-flex-inline tw-justify-start hover:tw-cursor-pointer tw-w-full tw-px-0 tw-mb-1",
        item.isFolder && "tw-font-bold",
        context.isSelected && "tw-bg-accent/70",
        context.isSelected && "tw-text-accent-foreground",
      )}
      {...context.itemContainerWithoutChildrenProps}
      /*
        eslint-disable-next-line @typescript-eslint/no-explicit-any --
        Fix: Type 'string' is not assignable to type '"button" | "submit" | "reset" | undefined'
      */
      {...(context.interactiveElementProps as any)}
    >
      {children}
    </div>
  );
}
