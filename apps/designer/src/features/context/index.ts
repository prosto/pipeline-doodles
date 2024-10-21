import { mixin } from "@repo/shared/utils";
import { createCascade, type CtxCascadeApi } from "context";
import { isFunction, partial } from "lodash-es";

type TArgs = never[];
type CB<T = unknown, Args extends TArgs = TArgs> = (...args: Args) => T;

interface ContextConsumptionApi<T extends Record<string, unknown>> {
  init: (
    initial: Partial<T>,
    initializer: (bind: <S>(name: keyof T, factory: () => S) => S) => void,
  ) => T;

  extend: <P extends Record<string, unknown>>(
    parent: CtxCascadeApi<P>,
    initializer: (bind: <S>(name: keyof T, factory: () => S) => S) => void,
  ) => T;

  wrap: <TObj extends object>(obj: TObj) => TObj;

  wrapFn: <Fn extends CB>(fn: Fn) => Fn;

  wrapFns: <Fn extends CB>(fns: Fn[]) => Fn[];
}

export type ContextApi<T extends Record<string, unknown>> = CtxCascadeApi<T> &
  ContextConsumptionApi<T>;

export function createContext<
  T extends Record<string, unknown>,
>(): ContextApi<T> {
  const native = createCascade<T>();

  function bind<S>(value: Partial<T>, name: keyof T, factory: () => S): S {
    const factoryResult = ctx.run(value, factory);

    Object.assign(value, {
      [name]: factoryResult,
    });

    return factoryResult;
  }

  const ctx: ContextApi<T> = mixin<CtxCascadeApi<T>, ContextConsumptionApi<T>>(
    native,
    {
      init(initial, initializer) {
        const context: Partial<T> = { ...initial };

        ctx.run(context, () => {
          initializer(partial(bind, context));
        });

        return context as T;
      },

      extend(parent, initializer) {
        const currentContext = parent.useX() as Partial<T>;
        return ctx.init(currentContext, initializer);
      },

      wrap(obj) {
        const currentContext = ctx.useX();

        for (const [propName, propValue] of Object.entries(obj)) {
          if (isFunction(propValue)) {
            Object.assign(obj, {
              [propName]: ctx.bind(currentContext, propValue),
            });
          }
        }

        return obj;
      },

      wrapFn(fn) {
        const currentContext = ctx.useX();
        return ctx.bind(currentContext, fn);
      },

      wrapFns(fns) {
        return fns.map((fn) => ctx.wrapFn(fn));
      },
    },
  );

  return ctx;
}
