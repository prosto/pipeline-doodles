export function mixin<T, U>(t: T, u: U): T & U;
export function mixin<T, U, V>(t: T, u: U, v: V): T & U & V;
export function mixin<T, U, V, W>(t: T, u: U, v: V, w: W): T & U & V & W;
export function mixin<T, U, V, W, X>(
  t: T,
  u: U,
  v: V,
  w: W,
  x: X,
): T & U & V & W & X;
export function mixin<T, U, V, W, X, Y>(
  t: T,
  u: U,
  v: V,
  w: W,
  x: X,
  y: Y,
): T & U & V & W & X & Y;

export function mixin<T extends object, U extends never>(
  obj: T,
  ...extensions: U[]
): T {
  for (const extension of extensions) {
    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(extension));
  }

  return obj;
}

type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
export function mixinBase<T extends object, U extends T>(
  obj: T,
  extension: Optional<U, keyof T>,
): U {
  Object.defineProperties(obj, Object.getOwnPropertyDescriptors(extension));
  return obj as U;
}
