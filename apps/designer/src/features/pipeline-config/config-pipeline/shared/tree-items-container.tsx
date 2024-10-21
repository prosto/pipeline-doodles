import type { HTMLProps } from "react";

interface TreeItemsContainerProps {
  children: React.ReactNode;
  containerProps: HTMLProps<HTMLUListElement>;
  depth: number;
}

export function TreeItemsContainer({
  containerProps,
  children,
  depth,
}: TreeItemsContainerProps): JSX.Element {
  return (
    <ul
      {...containerProps}
      style={{
        paddingLeft: `${depth > 0 ? depth + 10 : 0}px`,
      }}
    >
      {children}
    </ul>
  );
}
