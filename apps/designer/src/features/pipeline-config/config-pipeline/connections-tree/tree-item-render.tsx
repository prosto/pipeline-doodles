import { match } from "ts-pattern";

import { TreeItemElement } from "../shared/tree-item-element";
import { TreeItemElements } from "../shared/tree-item-elements";
import { TreeItemWithContext } from "../shared/tree-item-with-context";
import type { TreeItemProps } from "../types";

import { TreeItemConnection } from "./tree-item-connection";
import { TreeItemConnectionSocket } from "./tree-item-connection-socket";

export function TreeItemConnectionRender(props: TreeItemProps): JSX.Element {
  const { context } = props;

  return (
    <li className="tw-w-full" {...context.itemContainerWithChildrenProps}>
      {match(props)
        .with({ item: { data: { type: "connection" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemConnection />
          </TreeItemWithContext>
        ))
        .with({ item: { data: { type: "connection-socket" } } }, () => (
          <TreeItemWithContext props={props}>
            <TreeItemConnectionSocket />
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
