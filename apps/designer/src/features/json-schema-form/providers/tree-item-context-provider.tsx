import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import { useSingleton } from "@repo/ui/hooks";

import { treeItemContextFactory } from "../store/tree-item-context";
import type {
  SchemaTreeItemContext,
  TreeItemData,
  TreeItemRenderProps,
} from "../store/types";

export const TreeItemContext = createContext<SchemaTreeItemContext | undefined>(
  undefined,
);

interface SchemaEditorProviderProps {
  renderProps: TreeItemRenderProps;
}

export function TreeItemContextProvider({
  children,
  renderProps,
}: PropsWithChildren<SchemaEditorProviderProps>): JSX.Element {
  const treeItemContext = useSingleton(() =>
    treeItemContextFactory(renderProps),
  );

  // TODO: Find way to update context data when tree re-renders a tree item
  // so that child elements could update itself
  treeItemContext.actions.updateRenderProps(renderProps);

  return (
    <TreeItemContext.Provider value={treeItemContext}>
      {children}
    </TreeItemContext.Provider>
  );
}

export function useTreeItemContext<
  T extends TreeItemData = TreeItemData,
>(): SchemaTreeItemContext<T> {
  const ctx = useContext(TreeItemContext);

  if (ctx === undefined) {
    throw new Error(
      "useTreeItemContext can only be used in a TreeItemContextProvider tree",
    );
  }

  return ctx as unknown as SchemaTreeItemContext<T>;
}
