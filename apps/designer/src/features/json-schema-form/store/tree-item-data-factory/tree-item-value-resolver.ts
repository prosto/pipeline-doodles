import type { JSONSchema } from "@repo/json-schema";
import { invocationChainAsync, isDefined } from "@repo/shared/utils";
import { cloneDeep, get, has } from "lodash-es";

import { isSchemaValid } from "../schema-validation";
import { storeContext } from "../store-context";

import type { TreeItemFactoryContext } from "./types";

interface TreeItemValuesResolver {
  resolveItemDataValues: (
    ctx: TreeItemFactoryContext,
  ) => Promise<TreeItemFactoryContext>;
}

export function treeItemValuesResolver(): TreeItemValuesResolver {
  const {
    treeItems: {
      actions: { getTreeItem },
    },
    treeValues: { updateParentValue },
  } = storeContext.useX();

  function valueMatchesSchema(
    schema: JSONSchema,
    value?: unknown,
  ): Promise<boolean> {
    return isSchemaValid({
      value,
      schemaWithKey: { schema },
    });
  }

  // The chain below runs aa list of functions one by one with each deciding to stop invocation or proceed further
  const chain = invocationChainAsync<TreeItemFactoryContext>().use(
    function getValueFromParent(ctx, next) {
      const { key, value, parentIndex } = ctx;

      if (typeof value === "undefined") {
        const {
          data: { value: parentValue },
        } = getTreeItem(parentIndex);

        // taking value from parent object if it exists
        if (key && has(parentValue, [key])) {
          ctx.value = get(parentValue, [key]);
        }
      }

      return next();
    },

    async function assignInitialValue(ctx, next) {
      const { initialValue, key, parentIndex, schema } = ctx;

      if (!isDefined(initialValue) && key) {
        const {
          data: { initialValue: parentInitialValue },
        } = getTreeItem(parentIndex);

        // Covers both arbitrary objects and arrays
        if (typeof parentInitialValue === "object") {
          ctx.initialValue = get(parentInitialValue, [key]);
        }
      }

      if (!ctx.value && isDefined(ctx.initialValue)) {
        if (await valueMatchesSchema(schema, ctx.initialValue)) {
          ctx.value = cloneDeep(ctx.initialValue);
          ctx.valueSource = "initial";
        }
      }

      return next();
    },

    async function assignDefaultValue(ctx, next) {
      const { defaultValue, baseSchemaNode, variantSchemaNode, schema } = ctx;

      if (!isDefined(defaultValue)) {
        const baseDefault = baseSchemaNode.descriptor.defaultValue;
        const variantDefault = variantSchemaNode?.descriptor.defaultValue;

        if (
          isDefined(baseDefault) &&
          (await valueMatchesSchema(schema, baseDefault))
        ) {
          ctx.defaultValue = baseDefault;
        } else if (
          isDefined(variantDefault) &&
          (await valueMatchesSchema(schema, variantDefault))
        ) {
          ctx.defaultValue = variantDefault;
        }
      }

      if (!isDefined(ctx.value) && isDefined(ctx.defaultValue)) {
        ctx.value = cloneDeep(ctx.defaultValue);
        ctx.valueSource = "default";
      }

      return next();
    },

    async function updateParent({ key, value, parentIndex }, next) {
      if (key && value) {
        updateParentValue(parentIndex, key, value);
      }
      return next();
    },
  );

  return {
    resolveItemDataValues(
      ctx: TreeItemFactoryContext,
    ): Promise<TreeItemFactoryContext> {
      return chain.run(ctx);
    },
  };
}
