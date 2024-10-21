import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as SerperDevWebSearch } from "./serper_dev.schema";

export const schemas = [SerperDevWebSearch];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/websearch"),
  title: "Websearch",
  schemas,
});
