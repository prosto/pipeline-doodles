import { match } from "ts-pattern";

import {
  arrayDescriptor,
  booleanDescriptor,
  numberDescriptor,
  objectDescriptor,
  stringDescriptor,
} from "./extra-descriptors";
import type { SchemaPropertyDescriptor } from "./types";

export function jsonTypeToDescriptor(
  jsonValue: unknown,
): SchemaPropertyDescriptor {
  return match(jsonValue)
    .returnType<SchemaPropertyDescriptor>()
    .when(
      (value) => typeof value === "number",
      () => numberDescriptor,
    )
    .when(
      (value) => typeof value === "string",
      () => stringDescriptor,
    )
    .when(
      (value) => typeof value === "boolean",
      () => booleanDescriptor,
    )
    .when(
      (value) => Array.isArray(value),
      () => arrayDescriptor,
    )
    .when(
      (value) => typeof value === "object",
      () => objectDescriptor,
    )
    .otherwise(() => {
      throw new Error(
        `Can not find matching descriptor for ${JSON.stringify(jsonValue)}`,
      );
    });
}
