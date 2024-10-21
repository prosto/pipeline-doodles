import { useCallback } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { P } from "ts-pattern";

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
      type: P.union("number", "integer"),
    });
  },

  component() {
    return <FormFieldNumber />;
  },
};

export default renderer;

function FormFieldNumber(): JSX.Element {
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
      render={FieldInputNumber}
      rules={{
        validate,
      }}
    />
  );
}

function FieldInputNumber({ field }: FormFieldControllerProps): ReactElement {
  const {
    actions: { updatePropertyValue },
  } = useSchemaTree();

  const {
    index,
    data: {
      schemaNode: { isOptional },
      schema: { minimum, type },
    },
  } = useTreeItem();

  const onChange = useCallback(
    (
      evn: ChangeEvent<{
        value: unknown;
      }>,
    ) => {
      const strNumber = String(evn.target.value);
      const parsedValue =
        type === "number"
          ? Number.parseFloat(strNumber)
          : Number.parseInt(strNumber);

      const valueToSet = isNaN(parsedValue) ? undefined : parsedValue;

      updatePropertyValue(index, valueToSet);

      field.onChange({
        target: {
          value: valueToSet,
        },
      });
    },
    [index, field, updatePropertyValue, type],
  );

  const placeholder = `<number${isOptional ? ":optional" : ""}>`;

  return (
    <FormItem className="tw-flex-grow-2">
      <FormControl>
        <Input
          min={minimum}
          placeholder={placeholder}
          type="number"
          {...field}
          onChange={onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
