import RefParser from "@apidevtools/json-schema-ref-parser";
import { ensureIsDefined } from "@repo/shared/utils";

import type {
  SchemaReader,
  $Refs,
  ParserOptions,
  JSONSchema,
  SchemaReaderParams,
} from "./types";

export function schemaReader(params: SchemaReaderParams): SchemaReader {
  const parserOptions: ParserOptions = {
    mutateInputSchema: false,
    ...params.options,
  };

  function createParser(): RefParser<JSONSchema> {
    return new RefParser<JSONSchema>();
  }

  return {
    async dereference(schema = params.schema): Promise<[JSONSchema, $Refs]> {
      const parser = createParser();
      const parsedSchema = await parser.dereference(schema, parserOptions);
      return [parsedSchema, parser.$refs];
    },

    async bundle(schema = params.schema): Promise<[JSONSchema, $Refs]> {
      const parser = createParser();
      const parsedSchema = await parser.bundle(schema, parserOptions);

      return [parsedSchema, parser.$refs];
    },
    async resolve(schema = params.schema): Promise<$Refs> {
      const parser = createParser();
      return parser.resolve(schema, parserOptions);
    },

    async resolveWithSchema(
      schema = params.schema,
      refPath = "#",
    ): Promise<[JSONSchema, $Refs]> {
      const parser = createParser();
      const $refs = await parser.resolve(schema, parserOptions);
      return [$refs.get(refPath) as JSONSchema, $refs];
    },

    getSchema(schema = params.schema): Promise<JSONSchema> {
      if (typeof schema === "string") {
        const parser = createParser();
        return parser.parse(schema, parserOptions);
      }
      return Promise.resolve(ensureIsDefined(schema));
    },

    async jsonString(schema = params.schema): Promise<string> {
      return JSON.stringify(await this.getSchema(schema), null, 4);
    },
  };
}
