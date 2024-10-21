import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import * as chatGenerators from "./chat";
import { schema as OpenAIGenerator } from "./openai.schema";

export const schemas = [OpenAIGenerator];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/generators"),
  title: "Generators",
  schemas: [chatGenerators.bundle, ...schemas],
});
