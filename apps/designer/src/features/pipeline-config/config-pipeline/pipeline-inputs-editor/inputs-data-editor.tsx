import type { JsonWithMetadata } from "@repo/json-schema";
import { CheckSquare2 } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";

import { JsonSchemaForm } from "@/features/json-schema-form";
import type { SchemaEditorHandle } from "@/features/json-schema-form";
import type { TopLevelSchema } from "@/features/json-schema-form/store/types";
import { Button, Separator, buttonVariants } from "@repo/ui/components";
import { useNotification } from "@repo/ui/hooks";
import { cn } from "@repo/ui/utils";

import { useInputsDataEditor } from "../../hooks";

export function PipelineInputsEditor(): JSX.Element {
  const inputsEditor = useInputsDataEditor();

  const {
    state,
    actions: { setEditorAPI },
  } = inputsEditor;
  const { schemasToEdit, hasInputs } = useSnapshot(state);

  const editorHandle = useRef<SchemaEditorHandle>(null);
  useEffect(() => {
    if (editorHandle.current !== null && hasInputs) {
      setEditorAPI(editorHandle.current);
    }
  }, [editorHandle, setEditorAPI, hasInputs]);

  const { visible: msgIsVisible, showNotification } = useNotification();

  const onSubmitValues = useCallback(
    (_editorValues: Record<string, JsonWithMetadata>) => {
      // console.log("PipelineInputsEditor", editorValues);
      showNotification("success", 1000);
    },
    [showNotification],
  );

  if (!hasInputs) {
    return (
      <p className="tw-text-xs tw-text-muted-foreground tw-my-2">
        Canvas has no components with free (non-connected) inputs
      </p>
    );
  }

  return (
    <div>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "tw-flex tw-justify-start tw-w-full tw-bg-secondary/45 hover:tw-bg-secondary/45 tw-px-0 tw-rounded-none tw-rounded-t-md tw-rounded-b-none",
        )}
      >
        <span className="tw-ml-2 tw-font-bold tw-text-muted-foreground">
          Editor:
        </span>
        <span className="tw-ml-2 tw-font-bold">Pipeline Inputs</span>

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
      {/* <p className="tw-text-sm tw-text-muted-foreground">
        Edit non-connected pipeline inputs per component.
      </p> */}
      <Separator />
      <div className="tw-mb-1 tw-p-2 tw-bg-secondary/45 tw-rounded-b-md">
        <JsonSchemaForm
          onSubmitValues={onSubmitValues}
          ref={editorHandle}
          schemas={schemasToEdit as TopLevelSchema[]}
          settings={{
            showTopLevelItems: true,
            showTopLevelToolbar: false,
            expandTopLevelItems: false,
            objectLoaderOptions: {
              hideOptional: false,
            },
          }}
        />
      </div>
    </div>
  );
}
