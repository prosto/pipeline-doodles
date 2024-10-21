import type { JSONSchema, JSONSchema2020Extension } from "@repo/json-schema";

export type SchemaBaseUri = "https://haystack.deepset.ai";
export type SchemaBaseUriWithSlash = `${SchemaBaseUri}/${string}`;
export type SchemaId = `/${string}` | `${SchemaBaseUri}/${string}`;

export interface NodeJsonSchemaExtension extends JSONSchema2020Extension {
  $schema: "https://json-schema.org/draft/2020-12/schema";
  $id: SchemaId;
  title: string;
  description?: string;
  __baseSchemaId?: string;
  __pyType?: string;
  __pyModule?: string;
  __nodeType: "data" | "component" | "document-store" | "protocol";
  __defaultName?: string;
  __defaultSchema?: string;

  variadic?: boolean;
}

export type NodeJsonSchema = JSONSchema<NodeJsonSchemaExtension> &
  NodeJsonSchemaExtension;

export interface SchemaBundle {
  $id: SchemaId;
  title: string;
  description?: string;
  schemas: (SchemaBundle | NodeJsonSchema)[];
}
