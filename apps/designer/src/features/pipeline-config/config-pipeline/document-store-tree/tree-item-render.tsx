import { match } from "ts-pattern";

import { TreeItemEditor } from "../shared/tree-item-data-editor";
import { TreeItemElement } from "../shared/tree-item-element";
import { TreeItemElements } from "../shared/tree-item-elements";
import { TreeItemWithContext } from "../shared/tree-item-with-context";
import type { TreeItemProps } from "../types";

import { DocumentStoreTreeItem } from "./tree-item-document-store";
import { DocumentStorePropertyTreeItem } from "./tree-item-property";

export function ComponentTreeItemRender(props: TreeItemProps): JSX.Element {
  const { context } = props;
  return (
    <li className="tw-w-full" {...context.itemContainerWithChildrenProps}>
      {match(props)
        .with({ item: { data: { type: "document-store" } } }, () => (
          <TreeItemWithContext props={props}>
            <DocumentStoreTreeItem />
          </TreeItemWithContext>
        ))
        .with({ item: { data: { type: "editor-data" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemEditor />
          </TreeItemWithContext>
        ))
        .with({ item: { data: { type: "document-store-property" } } }, () => (
          <TreeItemWithContext props={props}>
            <DocumentStorePropertyTreeItem />
          </TreeItemWithContext>
        ))
        .with({ item: { data: { type: "canvas-elements" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemElements />
          </TreeItemWithContext>
        ))
        .with({ item: { data: { type: "canvas-element" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemElement />
          </TreeItemWithContext>
        ))
        .otherwise(() => (
          <span className="tw-ml-1">[UNKNOWN]</span>
        ))}
    </li>
  );
}
