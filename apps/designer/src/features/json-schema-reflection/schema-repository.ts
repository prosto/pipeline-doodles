import type {
  $Refs,
  DereferenceOptions,
  JSONObject,
  JSONSchema,
  JSONSchemaObject,
} from "@repo/json-schema";
import {
  getSchemaRegistry,
  nodeJsonSchemaReader,
} from "@repo/node-specs/registry";
import { cloneDeep } from "lodash-es";
import type { Pattern } from "node_modules/ts-pattern/dist/types/Pattern";
import { match } from "ts-pattern";

export interface ResolvedSchemaWithRefs {
  schema: JSONSchema;
  parentSchema?: JSONSchema;
  $refs: $Refs;
}

interface ResolveSchemaOptions {
  schema: JSONSchema | string;
  refPath?: string;
}

export interface SchemaRepository {
  findSchemas: (criteria: Pattern<JSONSchema>) => JSONSchema[];

  dereferenceSchema: (
    options: ResolveSchemaOptions,
  ) => Promise<ResolvedSchemaWithRefs>;
}

function normalizedOnDereference(): DereferenceOptions["onDereference"] {
  const objRefCache = new WeakSet<JSONSchemaObject>();

  function onDereference(
    _path: string,
    value: JSONObject,
    parent?: JSONObject,
    parentPropName?: string,
  ): void {
    if (!objRefCache.has(value)) {
      objRefCache.add(value);
    } else if (parent && parentPropName) {
      Object.assign(parent, {
        [parentPropName]: cloneDeep(value),
      });
    }
  }

  return onDereference;
}

export function schemaRepositoryFactory(): SchemaRepository {
  const schemaRegistry = getSchemaRegistry();

  return {
    findSchemas(criteria: Pattern<JSONSchema>): JSONSchema[] {
      const allSchemas = Array.from(schemaRegistry.values());

      return allSchemas.filter((schema) =>
        match(schema)
          .with(criteria, () => true)
          .otherwise(() => false),
      );
    },

    async dereferenceSchema({
      schema: schemaToResolve,
      refPath = "#",
    }): Promise<ResolvedSchemaWithRefs> {
      const jsonReader = nodeJsonSchemaReader({
        options: {
          dereference: {
            onDereference: normalizedOnDereference(),
          },
        },
      });

      const [_schema, $refs] = await jsonReader.dereference(schemaToResolve);

      return { schema: $refs.get(refPath) as JSONSchema, $refs };
    },
  };
}
