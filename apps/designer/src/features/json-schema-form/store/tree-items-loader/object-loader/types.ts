import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import type { SchemaTreeItem } from "../../types";
import type { ObjectLoaderOptions } from "../types";

export interface ObjectLoaderContext {
  options: ObjectLoaderOptions;
  consumedProperties: string[];
  schemaProperties: Map<string, SchemaNodeDescriptor>;
  valueProperties: Map<string, unknown>;
  valueAdditionalProperties: Map<string, unknown>;

  readonly treeItems: SchemaTreeItem[];
}
