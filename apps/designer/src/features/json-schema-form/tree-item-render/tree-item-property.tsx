import { TreeItemPropertyKey } from "./tree-item-property-key";
import { TreeItemPropertyValue } from "./tree-item-property-value";
import { TreeItemToolbar } from "./tree-item-toolbar/tree-item-toolbar";
import type { TreeItemRenderer } from "./types";

export const renderer: TreeItemRenderer = {
  predicate({
    item: {
      data: { type, parentSchemaType },
    },
  }) {
    return (
      (parentSchemaType === "object" || parentSchemaType === undefined) &&
      type === "schema-data-primitive"
    );
  },

  component() {
    return <TreeItemSchemaProperty />;
  },
};

export default renderer;

export function TreeItemSchemaProperty(): JSX.Element {
  return (
    <div className="tw-flex tw-flex-col">
      <div className="tw-flex tw-items-baseline">
        <div className="tw-flex-grow tw-w-1/3">
          <TreeItemPropertyKey />
        </div>

        <div className="tw-mx-3 tw-flex-none tw-font-extrabold tw-text-right">
          :
        </div>

        <div className="tw-flex-grow tw-w-1/2">
          <TreeItemPropertyValue className="tw-w-full" />
        </div>

        <div className="tw-ml-auto">
          <TreeItemToolbar removeTitle="Remove Property" />
        </div>
      </div>
    </div>
  );
}
