import { useCallback } from "react";
import type { ChangeEvent, ReactElement } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Textarea,
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
      format: "long-string",
    });
  },

  component() {
    return <FormFieldTextarea />;
  },
};

export default renderer;

function FormFieldTextarea(): JSX.Element {
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
      render={FieldInputTextArea}
      rules={{
        validate,
      }}
    />
  );
}

function FieldInputTextArea({ field }: FormFieldControllerProps): ReactElement {
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

  const placeholder = `<text${field.value === "" ? ":empty" : ""}>`;

  return (
    <FormItem className="tw-flex-grow-2">
      <FormControl>
        <Textarea placeholder={placeholder} {...field} onChange={onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
