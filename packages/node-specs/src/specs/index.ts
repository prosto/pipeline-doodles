import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import * as custom from "./custom";
import * as haystack from "./haystack";

export const bundle = schemaBundle({
  $id: schemaId("/specs"),
  title: "All Specs",
  schemas: [haystack.bundle, custom.bundle],
});
