import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as DocumentJoiner } from "./document_joiner.schema";

export const schemas = [DocumentJoiner];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/joiners"),
  title: "Joiners",
  schemas,
});
