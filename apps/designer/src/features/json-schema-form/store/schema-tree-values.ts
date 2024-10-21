import type { JSONObject, JSONValue } from "@repo/json-schema";
import { ensureIsDefined } from "@repo/shared/utils";
import { pullAt, set, unset } from "lodash-es";
import type { TreeItemIndex } from "react-complex-tree";
import { proxy } from "valtio";

import { storeContext } from "./store-context";
import type { SchemaTreeItem, SchemaTreeValues } from "./types";

export function schemaTreeValuesFactory(): SchemaTreeValues {
  const {
    treeItems: {
      actions: { getTreeItem },
    },
    treeMetadata,
  } = storeContext.useX();

  const values = proxy<JSONObject>({});

  function getParentValue(index: TreeItemIndex): object {
    const parentItem = getTreeItem(index);
    const {
      schemaType,
      key: parentKey,
      value: parentValue,
      parentIndex,
    } = parentItem.data;

    if (parentValue) {
      return parentValue;
    }

    if (schemaType === "array") {
      parentItem.data.value = [];
    } else if (schemaType === "object") {
      parentItem.data.value = {};
    }

    if (parentKey) {
      set(getParentValue(parentIndex), [parentKey], parentItem.data.value);
    }

    return ensureIsDefined(parentItem.data.value) as object;
  }

  function updateParentValue(
    parentIndex: TreeItemIndex,
    key: string,
    value?: unknown,
  ): void {
    const parentValue = getParentValue(parentIndex);
    set(parentValue, [key], value);
  }

  function updateValue(
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
    value?: unknown,
  ): void {
    const treeItem = getTreeItem(treeItemOrIndex);
    const { parentIndex, key } = treeItem.data;

    if (key) {
      updateParentValue(parentIndex, key, value);
    }

    treeItem.data.value = value;
  }

  function removeKey(treeItemOrIndex: SchemaTreeItem | TreeItemIndex): void {
    const {
      data: { key, parentIndex },
    } = getTreeItem(treeItemOrIndex);
    const {
      data: { value: parentValue },
    } = getTreeItem(parentIndex);

    if (key) {
      if (Array.isArray(parentValue)) {
        pullAt(parentValue, [Number(key)]);
      } else if (typeof parentValue === "object") {
        unset(parentValue, [key]);
      }
    }

    treeMetadata.removeMetadata(treeItemOrIndex);
  }

  function getValue<T = JSONValue>(index?: TreeItemIndex): T {
    if (index) {
      const treeItem = getTreeItem(index);
      return (treeItem.data.value ?? {}) as T;
    }

    return values as T;
  }

  function renameKey(index: TreeItemIndex, newKey?: string): void {
    const treeItem = getTreeItem(index);
    const parentIndex = treeItem.data.parentIndex;

    const oldKey = treeItem.data.key;
    treeItem.data.key = newKey;

    const parentValue = getParentValue(parentIndex);

    if (oldKey && oldKey !== newKey) {
      unset(parentValue, [oldKey]);
    }

    if (newKey) {
      set(parentValue, [newKey], treeItem.data.value);
    }

    treeMetadata.renameKey(index, oldKey, newKey);
  }

  function getArrayValueTreeItem(
    index: TreeItemIndex,
    pos: number,
  ): SchemaTreeItem {
    const arrayTreeItem = getTreeItem(index);
    const valueIndex = ensureIsDefined(arrayTreeItem.children?.[pos]);
    return getTreeItem(valueIndex);
  }

  function swapArrayKeys(
    index: TreeItemIndex,
    posFrom: number,
    posTo: number,
  ): void {
    const {
      data: { type, value: parentValue },
    } = getTreeItem(index);

    if (!Array.isArray(parentValue) || type !== "schema-data-array") {
      throw new Error("Should be tree item which represents array of values");
    }

    const treeItemFrom = getArrayValueTreeItem(index, posFrom);
    const treeItemTo = getArrayValueTreeItem(index, posTo);

    treeItemFrom.data.key = String(posTo);
    treeItemTo.data.key = String(posFrom);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Allow "any" value exchange
    [parentValue[posTo], parentValue[posFrom]] = [
      parentValue[posFrom],
      parentValue[posTo],
    ];
  }

  return {
    updateValue,

    removeKey,

    renameKey,

    getParentValue,

    updateParentValue,

    getValue,

    swapArrayKeys,
  };
}
