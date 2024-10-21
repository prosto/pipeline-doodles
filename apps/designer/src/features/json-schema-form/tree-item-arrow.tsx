import { Minus, Plus } from "lucide-react";

import { useTreeItemRenderProps } from "./hooks";

export function TreeItemArrow(): JSX.Element | null {
  const { item, context } = useTreeItemRenderProps();

  if (item.isFolder) {
    return context.isExpanded ? (
      <Minus className="tw-h-3 tw-w-3 tw-mr-1 tw-text-ring hover:tw-cursor-pointer" />
    ) : (
      <Plus className="tw-h-3 tw-w-3 tw-mr-1 hover:tw-cursor-pointer" />
    );
  }

  return null;
}
