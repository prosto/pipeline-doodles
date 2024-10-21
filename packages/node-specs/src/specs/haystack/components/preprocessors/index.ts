import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as DocumentCleaner } from "./document_cleaner.schema";
import { schema as DocumentSplitter } from "./document_splitter.schema";

export const schemas = [DocumentCleaner, DocumentSplitter];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/components/preprocessors"),
  title: "Preprocessors",
  schemas,
});
