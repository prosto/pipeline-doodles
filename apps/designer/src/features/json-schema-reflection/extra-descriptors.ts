import { schemaDescriptorFactory } from "@/features/json-schema-reflection/schema-descriptor";
import type { SchemaPropertyDescriptor } from "@/features/json-schema-reflection/types";

export const stringDescriptor = schemaDescriptorFactory({
  schema: {
    $id: "https://example.com/schemas/editor-types/string",
    title: "string",
    description: "Generic string with minimum 1 character",
    type: "string",
    minLength: 1,
  },
  isOptional: true,
  isAdditional: true,
});

export const multilineStringDescriptor = schemaDescriptorFactory({
  schema: {
    $id: "https://example.com/schemas/editor-types/string-multiline",
    title: "string (multiline)",
    description: "Generic multiline string with minimum 1 character",
    type: "string",
    format: "long-string",
    minLength: 1,
  },
  isOptional: true,
  isAdditional: true,
});

export const numberDescriptor = schemaDescriptorFactory({
  schema: {
    $id: "https://example.com/schemas/editor-types/number",
    title: "number",
    description: "Generic number",
    type: "number",
  },
  isOptional: true,
  isAdditional: true,
});

export const integerDescriptor = schemaDescriptorFactory({
  schema: {
    $id: "https://example.com/schemas/editor-types/integer",
    title: "integer",
    description: "Generic integer",
    type: "integer",
  },
  isOptional: true,
  isAdditional: true,
});

export const booleanDescriptor = schemaDescriptorFactory({
  schema: {
    $id: "https://example.com/schemas/editor-types/boolean",
    title: "boolean",
    description: "Generic boolean",
    type: "boolean",
  },
  isOptional: true,
  isAdditional: true,
});

export const objectDescriptor = schemaDescriptorFactory({
  schema: {
    $id: "https://example.com/schemas/editor-types/object",
    type: "object",
    title: "object (dict)",
    description: "Generic object (key value dictionary of arbitrary values)",
    additionalProperties: true,
  },
  isOptional: true,
  isAdditional: true,
});

export const arrayDescriptor = schemaDescriptorFactory({
  schema: {
    $id: "https://example.com/schemas/editor-types/array",
    type: "array",
    title: "array (list)",
    description: "Generic array (list of arbitrary values)",
  },
  isOptional: true,
  isAdditional: true,
});

export const additionalDescriptors: SchemaPropertyDescriptor[] = [
  stringDescriptor,
  multilineStringDescriptor,
  numberDescriptor,
  integerDescriptor,
  booleanDescriptor,
  objectDescriptor,
  arrayDescriptor,
];
