import { isDefined } from "@repo/shared/utils";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";

import { isSchemaValid } from "../schema-validation";

interface LookupVariantOptions {
  schemaNode: SchemaNodeDescriptor;
  value: unknown;
}

export async function lookupMatchingVariant({
  schemaNode,
  value,
}: LookupVariantOptions): Promise<SchemaNodeDescriptor | undefined> {
  if (isDefined(value)) {
    for (const variant of schemaNode.allVariants()) {
      // eslint-disable-next-line no-await-in-loop -- TODO
      const matchingSchema = await isSchemaValid({
        value,
        schemaWithKey: { schema: variant.schema },
      });

      if (matchingSchema) {
        return variant;
      }
    }
  }
}
