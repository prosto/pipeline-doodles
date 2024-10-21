import type { DefinedError } from "@repo/json-schema";
import { isDefined } from "@repo/shared/utils";

import { appendErrors, type FieldError } from "@repo/ui/form";

export function parseErrorSchema(
  ajvErrors: DefinedError[],
  validateAllFieldCriteria: boolean,
): Record<string, FieldError> {
  // Ajv will return empty instancePath when require error
  ajvErrors.forEach((error) => {
    if (error.keyword === "required") {
      error.instancePath += `/${error.params.missingProperty}`;
    }
  });

  return ajvErrors.reduce<Record<string, FieldError>>((previous, error) => {
    // `/deepObject/data` -> `deepObject.data`
    const path = error.instancePath.substring(1).replace(/\//g, ".");

    if (!isDefined(previous[path])) {
      previous[path] = {
        message: error.message,
        type: error.keyword,
      };
    }

    if (validateAllFieldCriteria) {
      const types = previous[path].types;
      const messages = types && types[error.keyword];

      previous[path] = appendErrors(
        path,
        validateAllFieldCriteria,
        previous,
        error.keyword,
        messages
          ? ([] as string[]).concat(messages as string[], error.message || "")
          : error.message,
      ) as FieldError;
    }

    return previous;
  }, {});
}
