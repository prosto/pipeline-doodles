import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";
import {
  isSchemaNodeArray,
  SchemaNodeTypes,
} from "@/features/json-schema-reflection";

const VARIANT_TYPES = [
  SchemaNodeTypes.SchemaNodeUnion,
  SchemaNodeTypes.SchemaNodeProtocol,
];

export function compatibleNodes(
  source: SchemaNodeDescriptor,
  target: SchemaNodeDescriptor,
): boolean {
  if (
    source.isPrimitive &&
    target.isPrimitive &&
    source.schemaType === target.schemaType
  ) {
    return true;
  }

  if (source.schemaId && source.schemaId === target.schemaId) {
    return true;
  }

  if (VARIANT_TYPES.includes(source.nodeType)) {
    return (
      source.variants.find((variant) => compatibleNodes(variant, target)) !==
      undefined
    );
  }

  if (VARIANT_TYPES.includes(target.nodeType)) {
    return (
      target.variants.find((variant) => compatibleNodes(source, variant)) !==
      undefined
    );
  }

  if (isSchemaNodeArray(source) && source.variadic) {
    return compatibleNodes(source.items[0], target);
  }

  if (isSchemaNodeArray(target) && target.variadic) {
    return compatibleNodes(source, target.items[0]);
  }

  if (isSchemaNodeArray(source) && isSchemaNodeArray(target)) {
    if (source.anyItems || target.anyItems) {
      return true;
    }

    return (
      source.items.find((sourceItem) =>
        target.items.find((targetItem) =>
          compatibleNodes(sourceItem, targetItem),
        ),
      ) !== undefined
    );
  }

  return false;
}
