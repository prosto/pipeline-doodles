import type { NodeJsonSchema } from "@repo/node-specs/types";
import { Info, Code2, GripVerticalIcon, MoreVertical } from "lucide-react";
import type { ReactNode } from "react";
import type { TreeItem, TreeItemRenderContext } from "react-complex-tree";

import { useEditorActions } from "@/features/editor/hooks";
import { schemaEditorTab } from "@/features/editor/store/editor-tab";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  buttonVariants,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import type { PresetTreeItem, TreeItemSchema } from "../store/types";

import { DraggableLIElement } from "./tree-item-draggable";

interface NodeTreeItemProps {
  item: PresetTreeItem;
  depth: number;
  title: ReactNode;
  arrow: ReactNode;
  context: TreeItemRenderContext;
  children: ReactNode;
}

function isSchemaPresetItem(
  item: PresetTreeItem,
): item is TreeItem<TreeItemSchema> {
  return item.data.type === "schema";
}

export function NodeTreeItem({
  item,
  title,
  arrow,
  context,
  children,
}: NodeTreeItemProps): JSX.Element {
  const isSchema = isSchemaPresetItem(item);

  return (
    <DraggableLIElement
      className="tw-w-full"
      item={item}
      {...context.itemContainerWithChildrenProps}
    >
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "tw-group tw-justify-start tw-flex-inline tw-w-full hover:tw-cursor-pointer",
          item.isFolder && "tw-font-bold",
          isSchema && "hover:tw-cursor-grab",
        )}
        {...context.itemContainerWithoutChildrenProps}
        /*
            eslint-disable-next-line @typescript-eslint/no-explicit-any --
            Fix: Type 'string' is not assignable to type '"button" | "submit" | "reset" | undefined'
          */
        {...(context.interactiveElementProps as any)}
      >
        {arrow}
        {!item.isFolder ? (
          <GripVerticalIcon className="tw-h-3 tw-w-5 tw-text-red-200 group-hover:tw-text-ring" />
        ) : null}
        <span>{title}</span>
        {isSchema ? <SchemaToolbarActions schema={item.data.schema} /> : null}
      </div>

      {children}
    </DraggableLIElement>
  );
}

function SchemaToolbarActions({
  schema,
}: {
  schema: NodeJsonSchema;
}): JSX.Element {
  const { addEditorTab } = useEditorActions();

  return (
    <div className="tw-ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="tw-p-0 tw-text-muted-foreground/10"
            size="sm"
            variant="ghost"
          >
            <MoreVertical className="tw-h-4 tw-w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              addEditorTab(
                schemaEditorTab(schema, {
                  title: schema.title,
                  id: schema.$id,
                }),
              );
            }}
          >
            <Code2 className="tw-h-4 tw-w-4 tw-mr-2" /> Show Schema
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!schema.description}>
            <Info className="tw-h-4 tw-w-4 tw-mr-2" /> Info
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
