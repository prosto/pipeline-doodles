export type NextChainFn = () => void;
export type StopChainFn = () => void;

export type ChainFn<T> = (
  context: T,
  next: NextChainFn,
  stopChain: StopChainFn,
) => void;

export interface InvocationChain<T> {
  use: (...chainFn: ChainFn<T>[]) => InvocationChain<T>;
  run: (context: T) => void;
}

export function invocationChain<T>(): InvocationChain<T> {
  const chainComponents: ChainFn<T>[] = [];

  const chain: InvocationChain<T> = {
    use(...chainFn: ChainFn<T>[]): InvocationChain<T> {
      chainComponents.push(...chainFn);
      return chain;
    },

    run(context: T): void {
      invokeChain(context, [...chainComponents]);
    },
  };

  return chain;
}

function invokeChain<T>(context: T, chainFns: ChainFn<T>[]): void {
  if (!chainFns.length) return;

  const nextFn = chainFns[0];

  nextFn(
    context,
    () => {
      invokeChain(context, chainFns.slice(1));
    },
    () => (chainFns.length = 0),
  );
}
