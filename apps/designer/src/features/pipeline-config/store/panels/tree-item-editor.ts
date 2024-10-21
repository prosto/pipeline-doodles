import type { TreeItem, TreeItemIndex } from "react-complex-tree";
import { proxy } from "valtio";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";
import type { PipelineDataPointer } from "@/features/pipeline-graph/types";

import { treeItemFactory } from "./tree-item-factory";
import type { TreeItemEditorData } from "./types";

interface FactoryProps {
  title: string;
  itemId: string;
  canEdit?: boolean;
  treeItems: Record<TreeItemIndex, TreeItem>;
  schemaNode: SchemaNodeDescriptor;
  dataPointer: PipelineDataPointer;
  children: TreeItemIndex[];
}

export function treeItemEditorFactory({
  title,
  itemId,
  children,
  canEdit = false,
  treeItems,
  schemaNode,
  dataPointer,
}: FactoryProps): TreeItemIndex {
  const index = `${itemId}-${dataPointer.paramsType}`;

  treeItems[index] = treeItemFactory<TreeItemEditorData>({
    index,
    children,
    isFolder: true,
    data: {
      type: "editor-data",
      title,
      schemaNode,
      dataPointer,
      editorState: proxy({
        canEdit,
        isEditing: false,
      }),
    },
  });

  return index;
}
