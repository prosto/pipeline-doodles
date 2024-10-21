import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as OpenAIChatGenerator } from "./openai.schema";

export const schemas = [OpenAIChatGenerator];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/generators/chat"),
  title: "Chat",
  schemas,
});
