import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import type { TreeItemProps } from "../types";

export const TreeItemContext = createContext<TreeItemProps | undefined>(
  undefined,
);

interface ProviderProps {
  props: TreeItemProps;
}

export function TreeItemContextProvider({
  children,
  props,
}: PropsWithChildren<ProviderProps>): JSX.Element {
  return (
    <TreeItemContext.Provider value={props}>
      {children}
    </TreeItemContext.Provider>
  );
}

export function useTreeItemContext<T = unknown>(): TreeItemProps<T> {
  const ctx = useContext(TreeItemContext);

  if (ctx === undefined) {
    throw new Error(
      "useTreeItemContext can only be used in a TreeItemContextProvider tree",
    );
  }

  return ctx as TreeItemProps<T>;
}
