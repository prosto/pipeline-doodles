import type { JsonWithMetadata } from "@repo/json-schema";
import { CheckSquare2 } from "lucide-react";
import React, { useCallback, useRef } from "react";

import { JsonSchemaFormMemo } from "@/features/json-schema-form";
import type { SchemaEditorHandle } from "@/features/json-schema-form";
import { usePipelineData } from "@/features/pipeline/hooks/use-pipeline-data";
import { pipelineParamsSchema } from "@/features/pipeline-graph";
import { Button, Separator, buttonVariants } from "@repo/ui/components";
import { useNotification } from "@repo/ui/hooks";
import { cn } from "@repo/ui/utils";

export function ConfigPipelineParameters(): JSX.Element {
  const {
    state: { parameters },
    actions: { updateParameters },
  } = usePipelineData();

  const editorHandle = useRef<SchemaEditorHandle>(null);
  const { visible: msgIsVisible, showNotification } = useNotification();

  const onSubmitValues = useCallback(
    (editorValues: Record<string, JsonWithMetadata>) => {
      updateParameters(editorValues.data.value);
      showNotification("success", 600);
    },
    [updateParameters, showNotification],
  );

  return (
    <div>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "tw-flex-inline tw-justify-start tw-w-full tw-bg-secondary/45 hover:tw-bg-secondary/45 tw-px-0 tw-rounded-none tw-rounded-t-md tw-rounded-b-none",
        )}
      >
        <span className="tw-ml-2 tw-font-bold tw-text-muted-foreground">
          Editor:
        </span>
        <span className="tw-ml-2 tw-font-bold">Pipeline Run</span>
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
            <CheckSquare2 className="tw-h-5 tw-w-5 tw-mr-1" />
            {msgIsVisible ? "Saved" : "Save"}
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
              schema: pipelineParamsSchema,
              name: "data",
              initialValue: parameters,
            },
          ]}
        />
      </div>
    </div>
  );
}
