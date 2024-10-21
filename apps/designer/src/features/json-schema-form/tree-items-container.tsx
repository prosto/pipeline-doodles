import type { HTMLProps } from "react";

import { useSchemaEditorSettings } from "./hooks";

export function TreeItemsContainer({
  containerProps,
  children,
  depth,
}: {
  children: React.ReactNode;
  containerProps: HTMLProps<HTMLUListElement>;
  depth: number;
}): JSX.Element {
  const { showTopLevelItems } = useSchemaEditorSettings();

  const startOffset = showTopLevelItems ? 1 : 0;
  const containerDepth = depth + startOffset;
  const offsetPx = `${containerDepth > 1 ? containerDepth + 14 : 0}px`;

  return (
    <ul
      {...containerProps}
      style={{
        marginLeft: offsetPx,
      }}
    >
      {children}
    </ul>
  );
}
