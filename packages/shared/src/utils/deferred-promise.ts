export interface DeferredPromise<T> {
  readonly promise: Promise<T>;
  readonly isResolved: boolean;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

export function deferredPromise<T>(): DeferredPromise<T> {
  let _resolve: DeferredPromise<T>["resolve"];
  let _reject: DeferredPromise<T>["reject"];
  let isResolved = false;

  const _promise = new Promise<T>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  return {
    get isResolved() {
      return isResolved;
    },

    get promise(): Promise<T> {
      return _promise;
    },
    resolve(value: T | PromiseLike<T>): void {
      _resolve(value);
      isResolved = true;
    },
    reject(reason?: unknown): void {
      _reject(reason);
      isResolved = true;
    },
  };
}
