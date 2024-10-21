import { Trash, MoreVertical, CopyX, MoveUp, MoveDown } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components";
import { useFormContext } from "@repo/ui/form";
import { cn } from "@repo/ui/utils";

import { useSchemaTree, useTreeItem } from "../../hooks";

import { TreeItemChangeType } from "./tree-item-change-type";

interface TreeItemToolbarProps {
  removeTitle?: string;
  removeUnregister?: string[];
}

export function TreeItemToolbar({
  removeTitle = "Remove Property",
  removeUnregister = [],
}: TreeItemToolbarProps): JSX.Element {
  const {
    actions: { removeProperty, updatePropertyValue, moveItem },
  } = useSchemaTree();

  const {
    index,
    data: { canRemove, initialValue, baseSchemaNode, defaultValue },
  } = useTreeItem();

  const { unregister, setValue } = useFormContext();

  return (
    <div className="tw-ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="tw-text-muted-foreground/60"
            size="sm"
            variant="ghost"
          >
            <MoreVertical className={cn("tw-h-4 tw-w-4")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {baseSchemaNode.hasVariants ? (
            <>
              <TreeItemChangeType />
              <DropdownMenuSeparator />
            </>
          ) : null}

          <DropdownMenuItem
            disabled={!canRemove}
            onClick={(evn) => {
              evn.stopPropagation();
              unregister(removeUnregister);
              removeProperty(index);
            }}
          >
            <Trash className="tw-h-4 tw-w-4 tw-mr-2" />
            {removeTitle}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!defaultValue}
            onClick={(evn) => {
              evn.stopPropagation();
              setValue(`${index}-value`, defaultValue);
              updatePropertyValue(index, defaultValue);
            }}
          >
            <CopyX className="tw-h-4 tw-w-4 tw-mr-2" />
            Set to default
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={typeof initialValue === "undefined"}
            onClick={(evn) => {
              evn.stopPropagation();
              setValue(`${index}-value`, initialValue);
              updatePropertyValue(index, initialValue);
            }}
          >
            <CopyX className="tw-h-4 tw-w-4 tw-mr-2" />
            Reset to initial
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(evn) => {
              evn.stopPropagation();
              moveItem(index, "up");
            }}
          >
            <MoveUp className="tw-h-4 tw-w-4 tw-mr-2" />
            Move Up
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(evn) => {
              evn.stopPropagation();
              moveItem(index, "down");
            }}
          >
            <MoveDown className="tw-h-4 tw-w-4 tw-mr-2" />
            Move Down
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
