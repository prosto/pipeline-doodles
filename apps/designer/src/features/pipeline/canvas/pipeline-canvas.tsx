"use client";

import { ExcalidrawWrapper } from "@/features/excalidraw";

import { useExcalidrawStore } from "../hooks/use-canvas";

import { CanvasDroppableElement } from "./canvas-droppable";

type PipelineCanvasProps = React.HTMLAttributes<HTMLDivElement>;

export function PipelineCanvas({
  className,
}: PipelineCanvasProps): JSX.Element {
  const {
    actions: { connect, disconnect },
  } = useExcalidrawStore();

  return (
    <CanvasDroppableElement className={className}>
      <ExcalidrawWrapper connect={connect} disconnect={disconnect} />
    </CanvasDroppableElement>
  );
}
