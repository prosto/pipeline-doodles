type TArgs = never[];
type FactoryFn<T = unknown, Args extends TArgs = TArgs> = (...args: Args) => T;
type AsyncFactoryFn<T = unknown, Args extends TArgs = TArgs> = (
  ...args: Args
) => Promise<T>;

export function once<T, Fn extends FactoryFn<T>>(fn: Fn): Fn {
  let result: T | undefined;

  return ((...args) => {
    if (!result) {
      result = fn(...args);
    }
    return result;
  }) as Fn;
}

export function asyncOnce<T, Fn extends AsyncFactoryFn<T>>(fn: Fn): Fn {
  let result: Promise<T> | undefined;

  return (async (...args) => {
    if (!result) {
      result = fn(...args);
    }
    return result;
  }) as Fn;
}
