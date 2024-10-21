import type { ReactElement } from "react";
import { useCallback } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components";
import { useFormContext } from "@repo/ui/form";

import { useSchemaTree, useTreeItem } from "../../hooks";
import type { FormFieldRenderer, FormFieldControllerProps } from "../types";
import { matchesPattern } from "../utils";

import { useFormFieldValidation } from "./use-form-field-actions";

export const renderer: FormFieldRenderer = {
  predicate({
    item: {
      data: { schema },
    },
  }) {
    return matchesPattern(schema, {
      type: "boolean",
    });
  },

  component() {
    return <FormFieldBoolean />;
  },
};

export default renderer;

function FormFieldBoolean(): JSX.Element {
  const {
    index,
    data: { value },
  } = useTreeItem();

  const fieldName = `${index}-value`;

  const form = useFormContext();
  const { validate } = useFormFieldValidation();

  return (
    <FormField
      control={form.control}
      defaultValue={value}
      name={fieldName}
      render={FieldInputBoolean}
      rules={{
        validate,
      }}
    />
  );
}

function FieldInputBoolean({
  field: { onChange: fieldChanged, value: fieldValue },
}: FormFieldControllerProps): ReactElement {
  const { index } = useTreeItem();

  const {
    actions: { updatePropertyValue },
  } = useSchemaTree();

  const onChange = useCallback(
    (value: boolean) => {
      updatePropertyValue(index, value);
      fieldChanged({
        target: {
          value,
        },
      });
    },
    [index, fieldChanged, updatePropertyValue],
  );

  return (
    <FormItem className="tw-flex-grow-2 tw-h-10 tw-flex tw-justify-stretch tw-items-center">
      <Select
        onValueChange={(boolString) => {
          onChange(boolString === "true");
        }}
        value={String(fieldValue)}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="true">
            <span className="tw-font-semibold">true</span>
          </SelectItem>
          <SelectItem value="false">
            <span className="tw-font-semibold">false</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </FormItem>
  );
}
