import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as TextFileToDocument } from "./txt.schema";

export const schemas = [TextFileToDocument];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/converters"),
  title: "Converters",
  schemas,
});
