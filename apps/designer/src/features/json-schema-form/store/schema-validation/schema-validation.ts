import type { DefinedError } from "@repo/json-schema";
import { isDefined } from "@repo/shared/utils";
import type { TreeItemIndex } from "react-complex-tree";

import type { ValidateResult } from "@repo/ui/form";

import { storeContext } from "../store-context";

import { parseErrorSchema } from "./error-parser";
import type { SchemaValidation } from "./types";
import { retrieveValidator } from "./validator";

export function schemaValidationFactory(): SchemaValidation {
  const {
    treeItems: {
      actions: { getTreeItem },
    },
  } = storeContext.use();

  return {
    async validateSchemaValues({ name }): Promise<unknown> {
      const { schema, value } = getTreeItem(name).data;

      const validator = await retrieveValidator({ schema });

      const valid = await validator(value);

      if (valid) {
        return value;
      }

      // const fieldErrors = parseErrorSchema(
      //   validator.errors as DefinedError[],
      //   true
      // );

      return value;
    },

    async validateFieldValue({ schemaNode, value }): Promise<ValidateResult> {
      if (typeof value === "undefined" && schemaNode.isOptional) {
        return true;
      }

      const validator = await retrieveValidator({ schema: schemaNode.schema });

      // if (typeof value === "undefined") {
      //   return descriptor.isOptional ? true : "required";
      // }

      const valid = await validator(value);

      if (valid) {
        return true;
      }

      const fieldErrors = parseErrorSchema(
        validator.errors as DefinedError[],
        true,
      );

      return Object.values(fieldErrors)
        .map((error) => error.message)
        .find(isDefined);
    },

    isValidKey(index: TreeItemIndex, key: string) {
      const parentIndex = getTreeItem(index).data.parentIndex;
      const parent = getTreeItem(parentIndex);

      if (parent.children?.length) {
        return (
          parent.children
            .map((childIndex) => getTreeItem(childIndex))
            .findIndex((treeItem) => {
              return treeItem.index !== index && treeItem.data.key === key;
            }) === -1
        );
      }

      return false;
    },
  };
}
