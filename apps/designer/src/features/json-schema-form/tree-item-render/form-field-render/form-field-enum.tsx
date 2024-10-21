import type { JSONSchema } from "@repo/json-schema";
import { simpleHashCode } from "@repo/shared/utils";
import { isEmpty } from "lodash-es";
import { useCallback, type ReactElement } from "react";
import { P } from "ts-pattern";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
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
      enum: P.array(),
    });
  },

  component() {
    return <FormFieldEnum />;
  },
};

export default renderer;

interface SelectEnumValue {
  key: string;
  label: string;
  value: unknown;
}

function FormFieldEnum(): JSX.Element {
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
      render={FieldInputEnum}
      rules={{
        validate,
      }}
    />
  );
}

function FieldInputEnum({
  field: { value: fieldValue, onChange: fieldOnChange },
}: FormFieldControllerProps): ReactElement {
  const {
    index,
    data: { isOptional, schema },
  } = useTreeItem();

  const { enumValues } = useEnumValues(schema);
  const selectedEnumKey = useEnumKey(enumValues, isOptional, fieldValue);

  const {
    actions: { updatePropertyValue },
  } = useSchemaTree();

  const onChange = useCallback(
    (newValue: unknown) => {
      updatePropertyValue(index, newValue);
      fieldOnChange({
        target: {
          value: newValue,
        },
      });
    },
    [index, fieldOnChange, updatePropertyValue],
  );

  return (
    <FormItem className="tw-flex-grow-2">
      <Select
        onValueChange={(enumKey) => {
          if (enumKey !== selectedEnumKey) {
            // setSelectedEnumKey(enumKey);
            onChange(enumValues[enumKey].value);
          }
        }}
        value={selectedEnumKey}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {Object.entries(enumValues).map(([key, { label }]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

function useEnumValues(schema: JSONSchema): {
  enumValues: Record<string, SelectEnumValue>;
  initialEnumKey?: string;
} {
  const enumValues: Record<string, SelectEnumValue> = {};

  if (schema.enum) {
    for (const enumValue of schema.enum) {
      const enumLabel = enumLabelFromValue(enumValue);
      const enumKey = String(simpleHashCode(enumLabel));
      enumValues[enumKey] = {
        key: enumKey,
        label: enumLabel,
        value: enumValue,
      };
    }
  }

  return { enumValues };
}

function enumLabelFromValue(value?: unknown): string {
  return JSON.stringify(value);
}

function useEnumKey(
  enumValues: Record<string, SelectEnumValue>,
  isOptional: boolean,
  value?: unknown,
): string | undefined {
  if (value) {
    const enumLabel = enumLabelFromValue(value);
    return String(simpleHashCode(enumLabel));
  }

  if (!isOptional && !isEmpty(enumValues)) {
    return Object.values(enumValues)[0].key;
  }
}
