"use client";

import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Toaster, TooltipProvider } from "@repo/ui/components";

import { DesignerAppPanels } from "./app-panels";

export function DesignerApp(): JSX.Element {
  return (
    <DndProvider backend={HTML5Backend}>
      <TooltipProvider delayDuration={0}>
        <DesignerAppPanels />
        <Toaster />
      </TooltipProvider>
    </DndProvider>
  );
}
