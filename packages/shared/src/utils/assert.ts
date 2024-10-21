export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${String(value)} is not defined`);
  }
}

export function ensureIsDefined<T>(value: T | undefined): T {
  assertIsDefined(value);
  return value;
}

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}
