import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import * as builders from "./builders";
import * as converters from "./converters";
import * as embedders from "./embedders";
import * as fetchers from "./fetchers";
import * as generators from "./generators";
import * as joiners from "./joiners";
import * as preprocessors from "./preprocessors";
import * as retrievers from "./retrievers";
import * as websearch from "./websearch";
import * as writers from "./writers";

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components"),
  title: "Components",
  schemas: [
    builders.bundle,
    converters.bundle,
    embedders.bundle,
    fetchers.bundle,
    generators.bundle,
    joiners.bundle,
    preprocessors.bundle,
    retrievers.bundle,
    websearch.bundle,
    writers.bundle,
  ],
});
