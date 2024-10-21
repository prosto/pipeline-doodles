import type { UnknownPattern } from "node_modules/ts-pattern/dist/types/Pattern";
import { match } from "ts-pattern";

export function matchesPattern(
  value: unknown,
  pattern: UnknownPattern,
): boolean {
  return match(value)
    .with(pattern, () => true)
    .otherwise(() => false);
}
