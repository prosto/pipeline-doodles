import { createContext } from "@/features/context";

import type { SchemaEditorStoreContext } from "./types";

export const storeContext = createContext<SchemaEditorStoreContext>();
