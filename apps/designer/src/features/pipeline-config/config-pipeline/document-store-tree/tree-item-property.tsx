import type { TreeItemDocumentStorePropertyData } from "@/features/pipeline-config/store/panels/types";

import { useTreeItemContext } from "../providers";
import { TreeItemInteractive } from "../shared/tree-item-interactive";

export function DocumentStorePropertyTreeItem(): JSX.Element {
  const {
    item: {
      data: { name, pyType },
    },
    arrow,
  } = useTreeItemContext<TreeItemDocumentStorePropertyData>();

  return (
    <TreeItemInteractive>
      {arrow}

      <span className="tw-ml-1 tw-mr-3 tw-text-muted-foreground tw-font-semibold">
        {name}
      </span>

      <span className="tw-text-xs tw-font-mono tw-text-muted-foreground">
        {pyType}
      </span>
    </TreeItemInteractive>
  );
}
