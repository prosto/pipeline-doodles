import { P } from "ts-pattern";

import type { TreeItemDataArray } from "../../store/types";
import { TreeItemSchemaProperty } from "../tree-item-property";
import type { TreeItemRenderer } from "../types";
import { matchesPattern } from "../utils";

const renderer: TreeItemRenderer<TreeItemDataArray> = {
  predicate({
    item: {
      data: {
        schemaNode: { schema },
      },
    },
  }) {
    return matchesPattern(schema, {
      type: "array",
      items: {
        type: P.union("number", "integer"),
      },
      options: {
        format: "multiline-string",
      },
    });
  },

  component() {
    return <TreeItemSchemaProperty />;
  },
};

export default renderer as TreeItemRenderer;
