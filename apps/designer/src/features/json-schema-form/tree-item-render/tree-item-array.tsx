import { useTreeItemRenderProps } from "../hooks";
import type { TreeItemDataArray } from "../store/types";
import { TreeItemArrow } from "../tree-item-arrow";
import { TreeItemInteractiveContainer } from "../tree-items-interactive-container";

import { TreeItemArrayControls } from "./tree-item-controls/tree-item-array-controls";
import { TreeItemPropertyKey } from "./tree-item-property-key";
import { TreeItemToolbar } from "./tree-item-toolbar/tree-item-toolbar";
import { TreeItemsArrayLoader } from "./tree-items-array-loader";
import type { TreeItemRenderer } from "./types";

export const renderer: TreeItemRenderer<TreeItemDataArray> = {
  predicate({
    item: {
      data: { schemaType },
    },
  }) {
    return schemaType === "array";
  },

  component() {
    return (
      <TreeItemsArrayLoader>
        <TreeItemArray />
      </TreeItemsArrayLoader>
    );
  },
};

export default renderer as TreeItemRenderer;

function TreeItemArray(): JSX.Element {
  const {
    context: { isExpanded },
    children,
    item: {
      data: {
        loadingState: { isLoaded },
      },
    },
  } = useTreeItemRenderProps<TreeItemDataArray>();

  return (
    <div data-component-type="TreeItemArray">
      <div className="tw-flex tw-justify-center tw-items-center tw-mb-2">
        <TreeItemInteractiveContainer>
          <TreeItemArrow />
        </TreeItemInteractiveContainer>

        <div className="tw-flex-grow">
          <TreeItemPropertyKey />
        </div>

        <div className="tw-ml-auto">
          <TreeItemToolbar />
        </div>
      </div>

      {/* Array Tree Items are rendered as children */}
      {children}

      {isExpanded && isLoaded ? (
        <TreeItemArrayControls className={["tw-mr-10"]} />
      ) : null}
    </div>
  );
}
