import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as ExampleComponent } from "./example.schema";

export const schemas = [ExampleComponent];

export const bundle = schemaBundle({
  $id: schemaId("/custom"),
  title: "Custom",
  schemas,
});
