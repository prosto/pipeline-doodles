import { memo } from "react";

import { TreeItemContextProvider } from "../providers";
import type { TreeItemRenderProps } from "../store/types";

import arrayMultilineRenderer from "./custom-render/tree-item-array-multiline-string";
import documentRenderer from "./custom-render/tree-item-document-render";
import arrayRenderer from "./tree-item-array";
import arrayValueRenderer from "./tree-item-array-value";
import objectRenderer from "./tree-item-object";
import propertyRenderer from "./tree-item-property";
import type { TreeItemRenderer } from "./types";

const renderers: TreeItemRenderer[] = [
  documentRenderer,
  objectRenderer,
  arrayMultilineRenderer,
  arrayRenderer,
  arrayValueRenderer,
  propertyRenderer,
];

export function TreeItemSchemaRender(
  props: TreeItemRenderProps,
): JSX.Element | null {
  const {
    context,
    item: {
      data: { isHidden },
    },
  } = props;

  // console.log("TreeItemSchemaRender", props.item.data.key, isHidden);

  if (isHidden) {
    return null;
  }

  return (
    <TreeItemContextProvider renderProps={props}>
      <li
        className="tw-w-full tw-mb-2"
        {...context.itemContainerWithChildrenProps}
      >
        <TreeItemMatchingRender {...props} />
      </li>
    </TreeItemContextProvider>
  );
}

export const TreeItemSchemaRenderMemo = memo(TreeItemSchemaRender);

export function TreeItemMatchingRender(
  props: TreeItemRenderProps,
): JSX.Element {
  const matchingRenderer = renderers.find(({ predicate }) => predicate(props));

  return matchingRenderer ? (
    matchingRenderer.component()
  ) : (
    <span className="tw-ml-1">[Unknown Item Type]</span>
  );
}
