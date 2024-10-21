import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, ReactElement, FocusEvent } from "react";
import { P } from "ts-pattern";

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
      type: "array",
      items: {
        type: P.union("number", "integer"),
      },
      options: {
        format: "multiline-string",
      },
    });
  },

  component() {
    return <FormFieldArrayOfNumbers />;
  },
};

export default renderer;

function FormFieldArrayOfNumbers(): JSX.Element {
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
      render={FieldInputArrayOfNumbers}
      rules={{
        validate,
      }}
    />
  );
}

function FieldInputArrayOfNumbers({
  field,
}: FormFieldControllerProps): ReactElement {
  const { index } = useTreeItem();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO Fix
  const { value: fieldValue, onChange: fieldOnChange } = field;
  const [currentValue, setCurrentValue] = useState<string>();

  const {
    actions: { updatePropertyValue },
  } = useSchemaTree();

  const onBlur = useCallback(
    (evt: FocusEvent<HTMLTextAreaElement>) => {
      const inputValue = evt.target.value;

      const onlyNumbers = inputValue
        .split(",")
        .map((str) => Number.parseFloat(str.trim()))
        .filter((x) => !isNaN(x));

      updatePropertyValue(index, onlyNumbers);

      fieldOnChange({
        target: {
          value: onlyNumbers,
        },
      });

      // setCurrentValue(onlyNumbers.join(", "));
    },
    [fieldOnChange, index, updatePropertyValue],
  );

  const onChange = useCallback(
    (
      evn: ChangeEvent<{
        value: unknown;
      }>,
    ) => {
      const inputValue = evn.target.value;
      setCurrentValue(inputValue as string);
    },
    [],
  );

  useEffect(() => {
    setCurrentValue(Array.isArray(fieldValue) ? fieldValue.join(", ") : "");
  }, [fieldValue]);

  return (
    <FormItem className="tw-flex-grow-2">
      <FormControl>
        <Textarea
          {...field}
          onBlur={onBlur}
          onChange={onChange}
          placeholder="<comma separated numbers>"
          value={currentValue}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
