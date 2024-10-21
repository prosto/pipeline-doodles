import { ensureIsDefined } from "@repo/shared/utils";

import { storeContext } from "../store-context";
import type { TreeItemMetadata } from "../types";

import type { TreeItemFactoryContext } from "./types";

interface TreeItemMetadataResolver {
  resolveMetadata: (ctx: TreeItemFactoryContext) => TreeItemMetadata;
}

export function treeItemMetadataResolver(): TreeItemMetadataResolver {
  const {
    treeMetadata: { getMetadata, metaKey },
  } = storeContext.useX();

  return {
    resolveMetadata({
      index,
      parentIndex,
      key,
    }: TreeItemFactoryContext): TreeItemMetadata {
      const keyPath = [metaKey(index, key)];
      const parentMetadata = getMetadata(parentIndex);

      parentMetadata.set(keyPath, {
        index,
      });

      return ensureIsDefined(parentMetadata.getTrieFromPath(keyPath));
    },
  };
}
