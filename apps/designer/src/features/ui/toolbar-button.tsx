import type { LucideProps } from "lucide-react";
import { forwardRef, type ComponentType } from "react";

import type { ButtonProps } from "@repo/ui/components";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components";
import type { ClassValue } from "@repo/ui/utils";
import { cn } from "@repo/ui/utils";

export interface ToolbarButtonProps extends ButtonProps {
  text?: string | React.ReactNode;
  Icon: ComponentType<LucideProps>;
  iconClass?: ClassValue;
  iconBeforeText?: boolean;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    { text, Icon, iconClass, iconBeforeText = true, className, ...other },
    ref,
  ) => {
    return (
      <Button
        className={className}
        ref={ref}
        variant="ghost"
        {...other}
        size="sm"
      >
        {iconBeforeText ? (
          <>
            <Icon
              className={cn("tw-h-4 tw-w-4", text && "tw-mr-2", iconClass)}
            />
            {text}
          </>
        ) : (
          <>
            {text}
            <Icon
              className={cn("tw-h-4 tw-w-4", text && "tw-ml-2", iconClass)}
            />
          </>
        )}
      </Button>
    );
  },
);
ToolbarButton.displayName = "ToolbarButton";

export const ToolbarButtonWithTooltip = forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(({ text, ...other }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToolbarButton ref={ref} {...other} />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
});
ToolbarButtonWithTooltip.displayName = "ToolbarButtonWithTooltip";
