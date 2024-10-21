import { match } from "ts-pattern";

import { TreeItemEditor } from "../shared/tree-item-data-editor";
import { TreeItemElement } from "../shared/tree-item-element";
import { TreeItemElements } from "../shared/tree-item-elements";
import { TreeItemWithContext } from "../shared/tree-item-with-context";
import type { TreeItemProps } from "../types";

import { TreeItemComponent } from "./tree-item-component";
import { TreeItemComponentProperty } from "./tree-item-property";

export function TreeItemComponentRender(props: TreeItemProps): JSX.Element {
  const { context } = props;
  return (
    <li className="tw-w-full" {...context.itemContainerWithChildrenProps}>
      {match(props)
        .with({ item: { data: { type: "component" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemComponent />
          </TreeItemWithContext>
        ))
        .with({ item: { data: { type: "editor-data" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemEditor />
          </TreeItemWithContext>
        ))
        .with({ item: { data: { type: "component-property" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemComponentProperty />
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
