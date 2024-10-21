import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as DocumentWriter } from "./document_writer.schema";

export const schemas = [DocumentWriter];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/writers"),
  title: "Writers",
  schemas,
});
