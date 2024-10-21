import { useTreeItem } from "../hooks";

import { TreeItemPropertyValue } from "./tree-item-property-value";
import { TreeItemToolbar } from "./tree-item-toolbar/tree-item-toolbar";
import type { TreeItemRenderer } from "./types";

export const renderer: TreeItemRenderer = {
  predicate({
    item: {
      data: { type, parentSchemaType },
    },
  }) {
    return parentSchemaType === "array" && type === "schema-data-primitive";
  },

  component() {
    return <TreeItemSchemaArrayValue />;
  },
};

export default renderer;

function TreeItemSchemaArrayValue(): JSX.Element {
  const {
    index,
    data: { key },
  } = useTreeItem();

  return (
    <div className="tw-flex tw-justify-center tw-items-baseline">
      <div className="tw-font-semibold tw-opacity-30 tw-mr-1">{`[${key}]:`}</div>
      <div className="tw-flex-grow">
        <TreeItemPropertyValue className="tw-w-full" />
      </div>

      <div className="tw-ml-auto">
        <TreeItemToolbar
          removeTitle="Remove Value"
          removeUnregister={[`${index}-value`]}
        />
      </div>
    </div>
  );
}
