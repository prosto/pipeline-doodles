import Chance from "chance";

type GenerateOptions = Partial<Chance.WordOptions> & {
  suffix?: string;
  firstValue?: string;
};

export type NameGeneratorFn = (opts?: GenerateOptions) => string;

export interface NameGenerator {
  generateName: NameGeneratorFn;
}

interface NameGeneratorProps {
  excludeNames: Set<string> | (() => Set<string>);
}

export function nameGenerator({
  excludeNames = new Set(),
}: NameGeneratorProps): NameGenerator {
  const chance = new Chance();

  function generateName(opts?: GenerateOptions): string {
    const namesToExclude =
      typeof excludeNames === "function" ? excludeNames() : excludeNames;

    if (opts?.firstValue && !namesToExclude.has(opts.firstValue)) {
      namesToExclude.add(opts.firstValue);
      return opts.firstValue;
    }

    const makeNewWord = (): string =>
      opts?.firstValue
        ? `${chance.word(opts)}-${opts.firstValue}`
        : chance.word(opts);

    let newWord = makeNewWord();
    while (namesToExclude.has(newWord)) {
      newWord = makeNewWord();
    }

    namesToExclude.add(newWord);

    return newWord;
  }

  return {
    generateName,
  };
}
