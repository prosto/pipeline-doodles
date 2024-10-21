import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as PromptBuilder } from "./prompt_builder.schema";

export const schemas = [PromptBuilder];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/builders"),
  title: "Builders",
  schemas,
});
