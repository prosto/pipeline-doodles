import type { ReactNode } from "react";
import type { TreeItem } from "react-complex-tree";
import { useDrag } from "react-dnd";

import { DndItemTypes } from "@/features/dnd";

import type { PresetTreeItem, TreeItemSchema } from "../store/types";

function isTreeItemSchema(
  item: PresetTreeItem,
): item is TreeItem<TreeItemSchema> {
  return "schema" in item.data;
}

type DraggableLIElementProps = {
  item: PresetTreeItem;
  children: ReactNode;
} & React.HTMLAttributes<HTMLLIElement>;

export function DraggableLIElement({
  item,
  children,
  className,
  ...otherProps
}: DraggableLIElementProps): JSX.Element {
  const isSchemaItem = isTreeItemSchema(item);
  const [{ opacity }, dragRef] = useDrag(() => ({
    type: DndItemTypes.NodeSpec,
    item: isSchemaItem && item.data.schema,
    canDrag: item.data.canDrag && isSchemaItem,
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }));

  const draggingStyle = {
    opacity,
  };

  return (
    <li
      ref={(ref) => {
        if (ref) {
          dragRef(ref);
        }
      }}
      {...otherProps}
      className={className}
      style={draggingStyle}
    >
      {children}
    </li>
  );
}
