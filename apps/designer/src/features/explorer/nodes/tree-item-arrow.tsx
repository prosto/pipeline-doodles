import { ChevronDown, ChevronRight } from "lucide-react";

interface NodeTreeItemArrowProps {
  isFolder?: boolean;
  isExpanded?: boolean;
}

export function NodeTreeItemArrow({
  isFolder,
  isExpanded,
}: NodeTreeItemArrowProps): JSX.Element | null {
  if (isFolder) {
    return isExpanded ? (
      <ChevronDown className="tw-h-4 tw-w-4 tw-text-ring" />
    ) : (
      <ChevronRight className="tw-h-4 tw-w-4" />
    );
  }

  return null;
}
