import { describe, it, expect } from "@jest/globals";

import { isSchemaCompatible } from "@/compatibility";
import type { JSONSchema } from "@/types";

type TestCase = [string, JSONSchema, JSONSchema, boolean];

const PASS = true;
const FAIL = false;

const testCases: TestCase[] = [
  ["boolean -> boolean", { type: "boolean" }, { type: "boolean" }, PASS],
  ["boolean -> number", { type: "boolean" }, { type: "number" }, FAIL],
  ["boolean -> integer", { type: "boolean" }, { type: "integer" }, FAIL],

  ["number -> number", { type: "number" }, { type: "number" }, PASS],
  ["number -> boolean", { type: "number" }, { type: "boolean" }, FAIL],
  ["number -> string", { type: "number" }, { type: "string" }, FAIL],
  ["number -> integer", { type: "number" }, { type: "integer" }, FAIL],

  ["integer -> integer", { type: "integer" }, { type: "integer" }, PASS],

  ["string -> string", { type: "string" }, { type: "string" }, PASS],
  ["string -> boolean", { type: "string" }, { type: "boolean" }, FAIL],
  ["string -> integer", { type: "string" }, { type: "integer" }, FAIL],
  ["string -> number", { type: "string" }, { type: "number" }, FAIL],

  ["same $ref", { $ref: "/example" }, { $ref: "/example" }, PASS],
  ["different $ref", { $ref: "/example" }, { $ref: "/different" }, FAIL],

  [
    "array of 'number' items",
    {
      type: "array",
      items: {
        type: "number",
      },
    },
    {
      type: "array",
      items: {
        type: "number",
      },
    },
    PASS,
  ],

  [
    "array of incompatible types",
    {
      type: "array",
      items: {
        type: "number",
      },
    },
    {
      type: "array",
      items: {
        type: "string",
      },
    },
    FAIL,
  ],

  [
    "array of '$ref' items",
    {
      type: "array",
      items: {
        $ref: "/example",
      },
    },
    {
      type: "array",
      items: {
        $ref: "/example",
      },
    },
    PASS,
  ],

  [
    "compatible array of union items -> array of number items",
    {
      type: "array",
      items: {
        anyOf: [
          {
            type: "string",
          },
          {
            $ref: "/byte-stream",
          },
        ],
      },
    },
    {
      type: "array",
      items: {
        type: "string",
      },
    },
    PASS,
  ],

  [
    "compatible array of number items -> array of union items",
    {
      type: "array",
      items: {
        anyOf: [
          {
            type: "string",
          },
          {
            $ref: "/byte-stream",
          },
        ],
      },
    },
    {
      type: "array",
      items: {
        $ref: "/byte-stream",
      },
    },
    PASS,
  ],
];

describe("schemaCompatibility", () => {
  it.each(testCases)(
    "schema is compatible %s",
    (_name, source, target, compatible) => {
      expect(isSchemaCompatible(source, target)).toBe(compatible);
    },
  );
});
