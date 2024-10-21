import React, { forwardRef } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  DropdownMenuItem,
} from "@repo/ui/components";

export const DialogMenuItem = forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem> & {
    onOpenChange?: (open: boolean) => void;
    triggerChildren: React.ReactNode;
  }
>((props, forwardedRef) => {
  const { triggerChildren, children, onSelect, onOpenChange, ...itemProps } =
    props;
  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          {...itemProps}
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.(event);
          }}
          ref={forwardedRef}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>{children}</AlertDialogContent>
    </AlertDialog>
  );
});
DialogMenuItem.displayName = "DialogMenuItem";
