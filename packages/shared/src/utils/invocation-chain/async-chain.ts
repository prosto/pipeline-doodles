export type NextChainFnAsync = () => Promise<void>;
export type StopChainFnAsync = () => Promise<void>;

export type ChainFnAsync<T> = (
  context: T,
  next: NextChainFnAsync,
  stopChain: StopChainFnAsync,
) => Promise<void> | void;

export type ChainList<T> =
  | ChainFnAsync<T>
  | ChainFnAsync<T>[]
  | InvocationChainAsync<T>;

export interface InvocationChainAsync<T> {
  use: (...chainFn: ChainList<T>[]) => InvocationChainAsync<T>;
  run: (context: T) => Promise<T>;
}

export function invocationChainAsync<T>(): InvocationChainAsync<T> {
  const chainComponents: ChainList<T>[] = [];

  const chain: InvocationChainAsync<T> = {
    use(...chainFn: ChainList<T>[]): InvocationChainAsync<T> {
      chainComponents.push(...chainFn);
      return chain;
    },

    async run(context: T): Promise<T> {
      await invokeChain(context, [...chainComponents]);
      return context;
    },
  };

  return chain;
}

async function invokeChain<T>(
  context: T,
  chainFns: ChainList<T>[],
): Promise<void> {
  if (!chainFns.length) return;

  const nextFn = chainFns[0];

  if (Array.isArray(nextFn)) {
    await invokeChain(context, [...nextFn]);
    await invokeChain(context, chainFns.slice(1));
    return;
  } else if (typeof nextFn === "object") {
    await nextFn.run(context);
    await invokeChain(context, chainFns.slice(1));
    return;
  }

  return nextFn(
    context,
    async () => {
      await invokeChain(context, chainFns.slice(1));
    },
    () => {
      chainFns.length = 0;
      return Promise.resolve();
    },
  );
}
