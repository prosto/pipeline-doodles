import { invocationChainAsync } from "@repo/shared/utils";

import type { TreeItemsObjectLoader } from "../types";

import { loadAdditionalProperties } from "./additional-properties-loader";
import { loadDynamicProperties } from "./dynamic-properties-loader";
import { contextFactory } from "./object-loader-context";
import { loadObjectProperties } from "./object-properties-loader";
import type { ObjectLoaderContext } from "./types";

export function treeItemsObjectLoader(): TreeItemsObjectLoader {
  const createContext = contextFactory();
  const loaderChain = invocationChainAsync<ObjectLoaderContext>();

  loaderChain.use(
    loadObjectProperties(),
    loadAdditionalProperties(),
    loadDynamicProperties(),
  );

  return {
    async loadObjectTreeItems(options) {
      const context = createContext(options);

      await loaderChain.run(context);

      return context.treeItems;
    },
  };
}
