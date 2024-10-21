import type { DefinedError, Options } from "ajv/dist/2020";
import { Ajv2020 } from "ajv/dist/2020";
import type { AnyValidateFunction } from "ajv/dist/types";
import ajvErrors from "ajv-errors";
import addFormats from "ajv-formats";

const defaultOptions = {
  $data: true,
  validateFormats: true,
};

const additionalVocabulary = [
  "__pyType",
  "__pyModule",
  "__nodeType",
  "__defaultName",
  "__defaultSchema",
  "__baseSchemaId",
  "options",
  "variadic",
];

export type { Ajv2020, AnyValidateFunction, DefinedError, Options };

export function ajvFactory(opts: Options = {}): Ajv2020 {
  const ajvOptions = { ...defaultOptions, ...opts };
  const ajv = new Ajv2020(ajvOptions);

  ajv.addVocabulary(additionalVocabulary);
  ajv.addFormat("long-string", {
    type: "string",
    validate: () => true,
  });
  addFormats(ajv);

  if (ajvOptions.allErrors) {
    ajvErrors(ajv);
  }

  return ajv;
}

export const ajv = ajvFactory();
