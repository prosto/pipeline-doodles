import { useCallback } from "react";
import type { ChangeEvent, ReactElement } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
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
      type: "string",
    });
  },

  component() {
    return <FormFieldString />;
  },
};

export default renderer;

function FormFieldString(): JSX.Element {
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
      render={FieldInputString}
      rules={{
        validate,
      }}
    />
  );
}

function FieldInputString({ field }: FormFieldControllerProps): ReactElement {
  const {
    actions: { updatePropertyValue },
  } = useSchemaTree();

  const { index } = useTreeItem();

  const onChange = useCallback(
    (
      evn: ChangeEvent<{
        value: unknown;
      }>,
    ) => {
      updatePropertyValue(index, evn.target.value);
      field.onChange(evn);
    },
    [index, field, updatePropertyValue],
  );

  const placeholder = `<string${field.value === "" ? ":empty" : ""}>`;

  return (
    <FormItem className="tw-flex-grow-2">
      <FormControl>
        <Input
          placeholder={placeholder}
          type="text"
          {...field}
          onChange={onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
