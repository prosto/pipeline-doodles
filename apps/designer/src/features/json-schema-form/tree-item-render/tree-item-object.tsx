import { useSchemaEditorSettings, useTreeItemRenderProps } from "../hooks";
import type { TreeItemDataObject } from "../store/types";
import { TreeItemArrow } from "../tree-item-arrow";
import { TreeItemInteractiveContainer } from "../tree-items-interactive-container";

import { TreeItemSchemaObjectControls } from "./tree-item-controls/tree-item-object-controls";
import { TreeItemPropertyKey } from "./tree-item-property-key";
import { TreeItemToolbar } from "./tree-item-toolbar/tree-item-toolbar";
import { TreeItemsObjectLoader } from "./tree-items-object-loader";
import type { TreeItemRenderer } from "./types";

export const renderer: TreeItemRenderer<TreeItemDataObject> = {
  predicate({
    item: {
      data: { schemaType },
    },
  }) {
    return schemaType === "object";
  },

  component() {
    return (
      <TreeItemsObjectLoader>
        <TreeItemSchemaObject />
      </TreeItemsObjectLoader>
    );
  },
};

export default renderer as TreeItemRenderer;

export function TreeItemSchemaObject(): JSX.Element {
  const {
    context: { isExpanded },
    children,
    item: {
      data: {
        isTopLevel,
        loadingState: { isLoaded },
      },
    },
  } = useTreeItemRenderProps<TreeItemDataObject>();

  return (
    <div data-component-type="TreeItemSchemaObject">
      <TreeItemObjectProperty isTopLevel={isTopLevel} />

      {/* Object Properties are rendered as children */}
      {children}

      {isExpanded && isLoaded ? (
        <TreeItemSchemaObjectControls className={["tw-mr-10"]} />
      ) : null}
    </div>
  );
}

function TreeItemObjectProperty({
  isTopLevel,
}: {
  isTopLevel?: boolean;
}): JSX.Element | null {
  const { showTopLevelItems, showTopLevelToolbar } = useSchemaEditorSettings();
  const showPropertyItem = !isTopLevel || showTopLevelItems;

  if (!showPropertyItem) {
    return null;
  }

  const showToolbar = !isTopLevel || showTopLevelToolbar;

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-mb-2">
      <TreeItemInteractiveContainer>
        <TreeItemArrow />
      </TreeItemInteractiveContainer>

      <div className="tw-flex-grow">
        <TreeItemPropertyKey />
      </div>

      {showToolbar ? (
        <div className="tw-ml-auto">
          <TreeItemToolbar />
        </div>
      ) : null}
    </div>
  );
}
