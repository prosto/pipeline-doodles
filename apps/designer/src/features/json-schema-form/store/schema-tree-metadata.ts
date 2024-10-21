import { trieMap } from "@repo/shared/utils";
import type { TreeItemIndex } from "react-complex-tree";

import { storeContext } from "./store-context";
import type {
  SchemaTreeItem,
  SchemaTreeMetadata,
  TreeItemMetadata,
} from "./types";

export function schemaTreeMetadataFactory(): SchemaTreeMetadata {
  const {
    treeItems: {
      actions: { getTreeItem },
    },
  } = storeContext.useX();

  const rootMetadata: TreeItemMetadata = trieMap();

  function getMetadata(
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
  ): TreeItemMetadata {
    const {
      data: { metadata },
    } = getTreeItem(treeItemOrIndex);

    return metadata ?? rootMetadata;
  }

  function metaKeyPath(index: TreeItemIndex, key?: string): string[] {
    return [metaKey(index, key)];
  }

  function metaKey(index: TreeItemIndex, key?: string): string {
    return String(key ?? index);
  }

  function removeMetadata(
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
  ): void {
    const {
      index,
      data: { key, parentIndex, metadata },
    } = getTreeItem(treeItemOrIndex);

    const {
      data: { metadata: parentMetadata },
    } = getTreeItem(parentIndex);

    metadata?.clear();
    parentMetadata?.delete(metaKeyPath(index, key));
  }

  function assignMetadata(
    treeItemOrIndex: SchemaTreeItem | TreeItemIndex,
  ): void {
    const treeItem = getTreeItem(treeItemOrIndex);
    const {
      index,
      data: { key, parentIndex },
    } = getTreeItem(treeItemOrIndex);

    const keyPath = [metaKey(index, key)];
    const parentMetadata = getMetadata(parentIndex);

    parentMetadata.set(keyPath, {
      index,
    });

    treeItem.data.metadata = parentMetadata.getTrieFromPath(keyPath);
  }

  function renameKey(
    index: TreeItemIndex,
    oldKey?: string,
    newKey?: string,
  ): void {
    const treeItem = getTreeItem(index);
    const parentIndex = treeItem.data.parentIndex;
    const parentMetadata = getMetadata(parentIndex);

    const fromKey = metaKey(index, oldKey);
    const toKey = metaKey(index, newKey);

    parentMetadata.rename(fromKey, toKey);
  }

  return {
    metaKey,

    getMetadata,

    removeMetadata,

    renameKey,

    assignMetadata,
  };
}
