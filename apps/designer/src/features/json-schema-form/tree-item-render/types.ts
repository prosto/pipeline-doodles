import type { ControllerProps } from "@repo/ui/form";

import type { TreeItemData, TreeItemRenderProps } from "../store/types";

export interface TreeItemRenderer<T extends TreeItemData = TreeItemData> {
  predicate: (item: TreeItemRenderProps<T>) => boolean;

  component: () => JSX.Element;
}

export type FormFieldControllerProps = Parameters<ControllerProps["render"]>[0];

export interface FormFieldRenderer<T extends TreeItemData = TreeItemData> {
  predicate: (props: TreeItemRenderProps<T>) => boolean;

  component: () => JSX.Element;
}
