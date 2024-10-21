import type { JsonWithMetadata } from "@repo/json-schema";
import { SquarePen, XSquare, CheckSquare2 } from "lucide-react";
import { forwardRef, useCallback, useState } from "react";
import { useSnapshot } from "valtio";

import { JsonSchemaFormMemo } from "@/features/json-schema-form";
import type { SchemaEditorHandle } from "@/features/json-schema-form";
import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";
import { usePipelineData } from "@/features/pipeline/hooks/use-pipeline-data";
import type { TreeItemEditorData } from "@/features/pipeline-config/store/panels/types";
import type { PipelineDataPointer } from "@/features/pipeline-graph/types";
import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  buttonVariants,
} from "@repo/ui/components";
import { useForwardRef, useNotification } from "@repo/ui/hooks";
import { cn } from "@repo/ui/utils";

import { useTreeItemContext } from "../providers/tree-item-context-provider";

import { TreeItemInteractive } from "./tree-item-interactive";

export function TreeItemEditor(): JSX.Element {
  const {
    children,
    context: { isExpanded },
    item: { data: itemData },
    arrow,
  } = useTreeItemContext<TreeItemEditorData>();

  const { title, dataPointer, schemaNode, editorState } = itemData;
  const snap = useSnapshot(editorState);

  return (
    <>
      <TreeItemInteractive>
        {arrow}

        <span className="tw-ml-1 tw-mr-3">{title}</span>

        {snap.canEdit ? (
          <div className="tw-ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn(
                    "tw-text-muted-foreground/60",
                    snap.isEditing && "tw-text-ring",
                  )}
                  disabled={snap.isEditing}
                  onClick={(evn) => {
                    evn.preventDefault();
                    evn.stopPropagation();
                    editorState.isEditing = true;
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <SquarePen className="tw-h-4 tw-w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </div>
        ) : null}
      </TreeItemInteractive>

      {snap.isEditing ? (
        <NodeParamsEditor
          className={cn(!isExpanded && "tw-hidden", "tw-p-2")}
          dataPointer={dataPointer}
          onEditorClosed={() => {
            editorState.isEditing = false;
          }}
          schemaNode={schemaNode}
        />
      ) : (
        children
      )}
    </>
  );
}

const NodeParamsEditor = forwardRef<
  SchemaEditorHandle,
  {
    schemaNode: SchemaNodeDescriptor;
    dataPointer: PipelineDataPointer;
    onEditorClosed?: () => void;
    className?: string;
  }
>(({ schemaNode, dataPointer, onEditorClosed, className }, ref) => {
  const {
    actions: { getData, updateData },
  } = usePipelineData();

  const [initialValue, setInitialValue] = useState(
    getData({ pointer: dataPointer }),
  );

  const editorHandle = useForwardRef<SchemaEditorHandle>(ref);
  const { visible: msgIsVisible, showNotification } = useNotification();

  const onSubmitValues = useCallback(
    (editorValues: Record<string, JsonWithMetadata>) => {
      const value = editorValues[dataPointer.paramsType];
      updateData({ pointer: dataPointer, newData: value });
      setInitialValue(value);
      showNotification("success", 1000);
    },
    [updateData, dataPointer, showNotification],
  );

  return (
    <div className={className}>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "tw-flex-inline tw-justify-start tw-w-full tw-bg-secondary/45 hover:tw-bg-secondary/45 tw-px-0 tw-rounded-none tw-rounded-t-md tw-rounded-b-none",
        )}
      >
        <span className="tw-ml-2 tw-font-bold tw-text-muted-foreground">
          Editor
        </span>
        <div className="tw-ml-auto tw-flex tw-items-center tw-mr-2">
          <Button
            className="tw-text-muted-foreground"
            disabled={msgIsVisible}
            onClick={(evn) => {
              evn.stopPropagation();
              editorHandle.current?.submitForm();
            }}
            size="sm"
            variant="ghost"
          >
            <CheckSquare2 className="tw-h-4 tw-w-4 tw-mr-1" />
            {msgIsVisible ? "Saved" : "Save"}
          </Button>

          <Button
            className="tw-text-muted-foreground"
            disabled={msgIsVisible}
            onClick={(evn) => {
              evn.stopPropagation();
              onEditorClosed?.();
            }}
            size="sm"
            variant="ghost"
          >
            <XSquare className="tw-h-4 tw-w-4 tw-mr-1" />
            Close
          </Button>
        </div>
      </div>
      <Separator />

      <div className="tw-mb-1 tw-p-2 tw-bg-secondary/45 tw-rounded-b-md">
        <JsonSchemaFormMemo
          onSubmitValues={onSubmitValues}
          ref={editorHandle}
          schemas={[
            {
              schema: schemaNode,
              name: dataPointer.paramsType,
              initialValue: initialValue.value,
            },
          ]}
        />
      </div>
    </div>
  );
});

NodeParamsEditor.displayName = "NodeParamsEditor";
