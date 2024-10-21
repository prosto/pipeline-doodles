import { createCascade } from "context";

import type { ReflectionContext } from "./types";

export const reflectionContext = createCascade<ReflectionContext>();
