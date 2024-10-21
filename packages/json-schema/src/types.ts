import type {
  $RefParser,
  ParserOptions,
} from "@apidevtools/json-schema-ref-parser";
import type { DereferenceOptions } from "@apidevtools/json-schema-ref-parser/dist/lib/options";
import type $LibRefs from "@apidevtools/json-schema-ref-parser/dist/lib/refs";
import type { JSONSchemaObject } from "@apidevtools/json-schema-ref-parser/dist/lib/types";
import type {
  ExtendedJSONSchema,
  JSONSchemaExtension,
} from "json-schema-to-ts";

export type PureExtendedJSONSchema<
  EXTENSION extends JSONSchemaExtension = JSONSchemaExtension,
> = Exclude<ExtendedJSONSchema<EXTENSION>, boolean>;

export interface JSONSchema2020Extension {
  [key: string]: unknown;
  prefixItems?: PureExtendedJSONSchema<JSONSchema2020Extension>[];
  enum?: unknown[];
  $defs?: Readonly<
    Record<string, PureExtendedJSONSchema<JSONSchema2020Extension>>
  >;
}

export type JSONSchema<
  T extends JSONSchema2020Extension = JSONSchema2020Extension,
> = PureExtendedJSONSchema<T>;

export type $Refs = $LibRefs<JSONSchema>;

export type { $RefParser, ParserOptions, DereferenceOptions, JSONSchemaObject };

export interface SchemaReader {
  dereference: (schema?: JSONSchema | string) => Promise<[JSONSchema, $Refs]>;

  bundle: (schema?: JSONSchema | string) => Promise<[JSONSchema, $Refs]>;

  resolve: (schema?: JSONSchema | string) => Promise<$Refs>;

  resolveWithSchema: (
    schema?: JSONSchema | string,
    refPath?: string,
  ) => Promise<[JSONSchema, $Refs]>;

  jsonString: (schema?: JSONSchema | string) => Promise<string>;

  getSchema: (schema?: JSONSchema | string) => Promise<JSONSchema>;
}

export interface SchemaReaderParams {
  schema?: JSONSchema | string;
  options?: ParserOptions;
}

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | JSONValue[];

export type JSONObject = Record<string, JSONValue>;

export interface JsonValueMetadata {
  schema: JSONSchema | string;
}

export interface JsonWithMetadata<T = JsonValueMetadata> {
  value: JSONObject;
  metadata: Record<string, T>;
}
