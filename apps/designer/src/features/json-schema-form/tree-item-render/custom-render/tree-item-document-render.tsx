import { schemaId } from "@repo/node-specs/schema";

import type { TreeItemDataObject } from "../../store/types";
import { TreeItemSchemaObject } from "../tree-item-object";
import { TreeItemsObjectLoader } from "../tree-items-object-loader";
import type { TreeItemRenderer } from "../types";

export const renderer: TreeItemRenderer<TreeItemDataObject> = {
  predicate({
    item: {
      data: { schemaNode },
    },
  }) {
    return schemaNode.schemaId === schemaId("/haystack/dataclasses/document");
  },

  component() {
    return (
      <TreeItemsObjectLoader hideDefaults include={["content"]}>
        <TreeItemSchemaObject />
      </TreeItemsObjectLoader>
    );
  },
};

export default renderer as TreeItemRenderer;
