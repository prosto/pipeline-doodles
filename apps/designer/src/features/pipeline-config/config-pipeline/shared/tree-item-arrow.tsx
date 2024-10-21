import { Minus, Plus } from "lucide-react";
import type { TreeItem, TreeItemRenderContext } from "react-complex-tree";

interface TreeItemArrowProps {
  item: TreeItem;
  context: TreeItemRenderContext;
}

export function TreeItemArrow({
  item,
  context,
}: TreeItemArrowProps): JSX.Element | null {
  if (item.isFolder) {
    return context.isExpanded ? (
      <Minus className="tw-h-3 tw-w-3 tw-text-ring" />
    ) : (
      <Plus className="tw-h-3 tw-w-3" />
    );
  }

  return null;
}
