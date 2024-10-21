import { ensureIsDefined } from "../assert";
import { mixin } from "../mixin";

export type ChainContext<Data extends object> = {
  getOptional: <T>(name: keyof Data, defaultValue?: T) => T | undefined;
  getProperty: <T>(name: keyof Data, defaultValue?: T) => T;
  setProperty: (name: keyof Data, value: unknown) => void;
} & Data;

export function chainContextFactory<Data extends object>(
  initialCtx: Data,
): ChainContext<Data> {
  const context: ChainContext<Data> = mixin(initialCtx, {
    getOptional<T>(name: keyof Data, defaultValue?: T): T | undefined {
      return (context[name] ?? defaultValue) as T;
    },

    getProperty<T>(name: keyof Data, defaultValue?: T): T {
      return ensureIsDefined(context.getOptional(name, defaultValue));
    },

    setProperty(name: keyof Data, value: unknown): void {
      Object.assign(context, {
        [name]: value,
      });
    },
  });

  return context;
}
