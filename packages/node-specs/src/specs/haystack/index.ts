import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import * as components from "./components";
import * as dataclasses from "./dataclasses";
import * as documentStores from "./document-stores";
import * as utils from "./utils";

export const bundle = schemaBundle({
  $id: schemaId("/haystack"),
  title: "Haystack",
  schemas: [
    components.bundle,
    dataclasses.bundle,
    utils.bundle,
    documentStores.bundle,
  ],
});
