"use client";

import type { NodeJsonSchema } from "@repo/node-specs/types";
import { useDrop } from "react-dnd";

import { DndItemTypes } from "@/features/dnd";
import { cn } from "@repo/ui/utils";

import { usePipelineCanvas } from "../hooks/use-canvas";

interface CollectedProps {
  canDrop: boolean;
}

type CanvasDroppableElementProps = React.HTMLAttributes<HTMLLIElement>;

export function CanvasDroppableElement({
  className,
  children,
}: CanvasDroppableElementProps): JSX.Element {
  const {
    actions: { addElementsFromSchema },
  } = usePipelineCanvas();

  const [{ canDrop }, drop] = useDrop<NodeJsonSchema, unknown, CollectedProps>({
    accept: DndItemTypes.NodeSpec,
    drop: (schema, monitor) => {
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const { x: clientX, y: clientY } = clientOffset;

        void addElementsFromSchema(schema, {
          clientX,
          clientY,
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      className={cn(
        className,
        canDrop && "tw-border-dashed tw-border-ring tw-border",
      )}
      ref={(ref) => {
        if (ref) {
          drop(ref);
        }
      }}
    >
      {children}
    </div>
  );
}
