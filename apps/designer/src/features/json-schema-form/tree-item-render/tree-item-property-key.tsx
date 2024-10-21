import { isDefined } from "@repo/shared/utils";
import { useCallback } from "react";
import type { ReactElement, ChangeEvent } from "react";

import {
  Badge,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components";
import { useFormContext } from "@repo/ui/form";
import { cn } from "@repo/ui/utils";

import {
  useSchemaTree,
  useSchemaValidation,
  useTreeItem,
  useTreeItemRenderProps,
} from "../hooks";
import { TreeItemInteractiveContainer } from "../tree-items-interactive-container";

import type { FormFieldControllerProps } from "./types";

export function TreeItemPropertyKey(): JSX.Element {
  const {
    context: { isExpanded },
    item: {
      data: {
        key,
        canEditKey,
        isAdditional,
        isOptional,
        schemaType,
        title,
        description,
        isArrayValue,
        isComplexObject,
      },
    },
  } = useTreeItemRenderProps();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {canEditKey ? (
            <FormFieldKey />
          ) : (
            <div
              className={cn(
                "tw-inline-flex tw-items-center",
                "tw-font-semibold",
              )}
            >
              {isArrayValue ? (
                <>
                  <span className="tw-opacity-30 tw-mr-1">{`[${key}]:`}</span>
                  {title}
                </>
              ) : (
                <>
                  <span>{key}</span>
                  {isComplexObject && title ? (
                    <span className="tw-text-muted-foreground tw-text-xs tw-font-mono tw-ml-1">
                      [{title}]
                    </span>
                  ) : null}
                </>
              )}

              <TreeItemInteractiveContainer asChild>
                <span
                  className={cn(
                    "tw-ml-2 tw-opacity-70 tw-font-semibold hover:tw-cursor-pointer hover:tw-opacity-100",
                    isExpanded && "tw-text-ring",
                  )}
                >
                  {schemaType === "object" ? "{...}" : null}
                  {schemaType === "array" ? "[...]" : null}
                </span>
              </TreeItemInteractiveContainer>
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent className="tw-min-w-60 tw-max-w-[500px]">
          <div className="tw-flex">
            <p className="tw-font-semibold">Description:</p>
            <div className="tw-ml-auto tw-pl-2">
              <Badge variant="secondary">
                {isOptional ? "optional" : "required"}
              </Badge>
              {isAdditional ? (
                <Badge className="tw-ml-2" variant="secondary">
                  additional
                </Badge>
              ) : null}
            </div>
          </div>
          <p className="tw-text-sm tw-text-muted-foreground tw-mt-2">
            {description ?? "No description"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FormFieldKey(): JSX.Element {
  const {
    index,
    data: { key },
  } = useTreeItem();
  const { isValidKey } = useSchemaValidation();

  const { control } = useFormContext();
  const fieldName = `${index}-key`;

  function validate(keyValue?: string): boolean | string {
    if (!isDefined(keyValue) || keyValue.trim().length === 0) {
      return "key is required";
    }

    if (!isValidKey(index, keyValue)) {
      return "key should be unique";
    }

    return true;
  }

  return (
    <FormField
      control={control}
      defaultValue={key}
      name={fieldName}
      render={FieldInputKey}
      rules={{ validate }}
    />
  );
}

function FieldInputKey({ field }: FormFieldControllerProps): ReactElement {
  const {
    actions: { updatePropertyKey },
  } = useSchemaTree();

  const { index } = useTreeItem();
  const { trigger } = useFormContext();

  const onChange = useCallback(
    (evn: ChangeEvent<{ value: string }>) => {
      async function updateKey(): Promise<void> {
        field.onChange(evn);
        const isValid = await trigger(field.name);
        if (isValid) {
          updatePropertyKey(index, evn.target.value);
        }
      }

      void updateKey();
    },
    [index, field, trigger, updatePropertyKey],
  );

  return (
    <FormItem>
      <FormControl>
        <Input
          className="tw-border-input/20 tw-font-semibold tw-text-muted-foreground"
          placeholder="<key>"
          type="text"
          {...field}
          onChange={onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
