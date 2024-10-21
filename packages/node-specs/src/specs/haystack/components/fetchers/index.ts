import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as LinkContentFetcher } from "./link-content.schema";

export const schemas = [LinkContentFetcher];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/fetchers"),
  title: "Fetchers",
  schemas,
});
