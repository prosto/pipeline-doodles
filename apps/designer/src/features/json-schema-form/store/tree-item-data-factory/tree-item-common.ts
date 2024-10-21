import { isDefined } from "@repo/shared/utils";

import { storeContext } from "../store-context";
import type { TreeItemData } from "../types";

import { treeItemMetadataResolver } from "./tree-item-metadata-resolver";
import { treeItemValuesResolver } from "./tree-item-value-resolver";
import type { TreeItemFactoryContext } from "./types";

export async function treeItemDataCommon(
  ctx: TreeItemFactoryContext,
): Promise<TreeItemData> {
  const {
    treeItems: {
      actions: { getTreeItem },
    },
  } = storeContext.useX();

  const { baseSchemaNode, variantSchemaNode, index, parentIndex } = ctx;

  const {
    data: { schemaType: parentSchemaType },
    children: parentChildren,
  } = getTreeItem(parentIndex);

  const { resolveItemDataValues } = treeItemValuesResolver();
  const { resolveMetadata } = treeItemMetadataResolver();

  const {
    isOptional,
    descriptor: { isAdditional },
    propertyName,
    description: propertyDescription,
  } = baseSchemaNode;

  const schemaNode = variantSchemaNode ?? baseSchemaNode;
  const { schema, schemaType, title, description } = schemaNode;

  const isHidden = false;
  const isTopLevel = parentIndex === "root";
  const isParentArray = parentSchemaType === "array";
  const isComplexObject = schemaType === "object" || schemaType === "array";
  const isArrayValue = parentSchemaType === "array";
  const canEditKey = getCanEditKey();
  const canRemove = isOptional;

  const key = getInitialKey();
  const { initialValue, defaultValue, value, valueSource } =
    await resolveItemDataValues(ctx.newContext({ key }));
  const metadata = resolveMetadata(ctx.newContext({ key }));

  function getCanEditKey(): boolean {
    if (isTopLevel || isParentArray) {
      return false;
    }

    return isAdditional;
  }

  function getInitialKey(): string | undefined {
    if (isDefined(ctx.key)) {
      return ctx.key;
    }

    if (isTopLevel) {
      return String(index);
    } else if (isParentArray) {
      return String(parentChildren?.length ?? 0);
    }
    return propertyName;
  }

  return {
    type: "unknown",
    parentIndex,
    metadata,

    baseSchemaNode,
    variantSchemaNode,
    schemaNode,
    schema,
    schemaType,
    parentSchemaType,

    isTopLevel,
    isOptional,
    isAdditional,
    isComplexObject,
    isArrayValue,
    isHidden,
    canRemove,
    canEditKey,

    key,
    value,
    initialValue,
    defaultValue,
    valueSource,

    propertyName,
    title,
    description: propertyDescription ?? description,
  };
}
