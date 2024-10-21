import type { TreeItemElementsData } from "@/features/pipeline-config/store/panels/types";

import { useTreeItemContext } from "../providers";

import { TreeItemInteractive } from "./tree-item-interactive";

export function TreeItemElements(): JSX.Element {
  const {
    children,
    item: {
      data: { title },
    },
    arrow,
  } = useTreeItemContext<TreeItemElementsData>();

  return (
    <>
      <TreeItemInteractive>
        {arrow}
        <span className="tw-ml-1 tw-mr-3">{title}</span>
      </TreeItemInteractive>

      {children}
    </>
  );
}
