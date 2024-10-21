import type { FieldValues, ValidateResult } from "@repo/ui/form";

import { useSchemaValidation, useTreeItem } from "../../hooks";

export function useFormFieldValidation(): {
  validate: (fieldValue: FieldValues) => Promise<ValidateResult>;
} {
  const schemaValidation = useSchemaValidation();

  const {
    data: { schemaNode },
  } = useTreeItem();

  async function validate(fieldValue: FieldValues): Promise<ValidateResult> {
    const result = await schemaValidation.validateFieldValue({
      schemaNode,
      value: fieldValue,
    });

    return result;
  }

  return { validate };
}
