import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

interface CollapsiblePanelSectionProps {
  initiallyOpen?: boolean;
  title: string;
  children?: React.ReactNode;
}

export function CollapsiblePanelSection({
  initiallyOpen = true,
  title,
  children,
}: CollapsiblePanelSectionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <Collapsible
      className="tw-space-y-2"
      onOpenChange={setIsOpen}
      open={isOpen}
    >
      <div className="tw-flex tw-items-center">
        <CollapsibleTrigger>
          <h4
            className={cn(
              "tw-text-lg tw-font-semibold tw-tracking-tight tw-mr-1",
              isOpen && "tw-text-section",
              !isOpen && "tw-text-section/60",
            )}
          >
            {title}
          </h4>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="tw-space-y-2" forceMount hidden={!isOpen}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
