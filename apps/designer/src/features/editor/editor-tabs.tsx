"use client";

import { Columns2, Plus as PlusIcon, X as XIcon } from "lucide-react";
import { useSnapshot } from "valtio/react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  TooltipTrigger,
  Button,
  TooltipContent,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { EditorTabRenderer } from "./editor-tab-renderer";
import { useEditorActions, useEditorView } from "./hooks";

interface EditorTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  viewId: string;
}

export function EditorTabs({
  className,
  viewId,
}: EditorTabsProps): JSX.Element {
  const editorView = useEditorView(viewId);
  const viewSnap = useSnapshot(editorView);
  const tabsSnap = viewSnap.tabs;

  const { addDefaultEditorTab, closeTab, setActiveTab, splitView } =
    useEditorActions();

  return (
    <Tabs
      activationMode="manual"
      className={cn("tw-flex tw-flex-col", className)}
      value={viewSnap.activeTabId}
    >
      <div className="tw-px-1 tw-flex tw-bg-muted/100 tw-text-muted-foreground">
        <TabsList className="tw-justify-start tw-bg-inherit">
          {tabsSnap.map((tab) => (
            <TabsTrigger
              key={tab.id}
              onClick={() => {
                setActiveTab(viewId, tab.id);
              }}
              value={tab.id}
            >
              <span>{tab.title}</span>
              <Button
                asChild
                className="tw-h-4 tw-w-4 tw-ml-2 tw-border-none tw-bg-inherit"
                onClick={(event) => {
                  event.stopPropagation();
                  closeTab(viewId, tab.id);
                }}
                size="icon"
                variant="outline"
              >
                <XIcon />
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <Tooltip>
          <TooltipTrigger asChild className="tw-mr-auto">
            <Button
              onClick={() => {
                addDefaultEditorTab(viewId, true);
              }}
              size="icon"
              variant="ghost"
            >
              <PlusIcon className="tw-h-4 tw-w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Tab</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                splitView();
              }}
              size="icon"
              variant="ghost"
            >
              <Columns2 className="tw-h-4 tw-w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Split View</TooltipContent>
        </Tooltip>
      </div>
      {tabsSnap.map((tab) => (
        <TabsContent
          className="tw-flex-grow tw-mt-0"
          forceMount // avoid re-render - hide instead
          hidden={viewSnap.activeTabId !== tab.id} // avoid re-render - hide instead
          key={tab.id}
          value={tab.id}
        >
          <EditorTabRenderer tabId={tab.id} viewId={viewId} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
