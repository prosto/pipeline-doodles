import { isDefined } from "@repo/shared/utils";
import { subscribe } from "valtio";

import { storeContext } from "./store-context";

/**
 * Listens to changes in treeItems (a proxy) and whenever there are any informs Tree component using `notifyChanges`
 * so that it re-renders changed tree elements
 */
export function schemaTreeSync(): void {
  const {
    treeItems: {
      state: { treeItems },
    },
    dataProvider: { notifyChanges },
  } = storeContext.useX();

  const syncTreeWithTreeItems: Parameters<typeof subscribe>[1] = (ops) => {
    const addedItems: string[] = [];
    const deletedItems: string[] = [];
    const updatedItems: string[] = [];

    for (const op of ops) {
      if (op[0] === "set") {
        const [, path, _newValue, prevValue] = op;
        const [index, ...keyPath] = path;
        if (keyPath.length === 0 && !isDefined(prevValue)) {
          addedItems.push(String(index));
        } else if (isDefined(prevValue)) {
          updatedItems.push(String(index));
        }
      } else if (op[0] === "delete") {
        const [, path, _prevValue] = op;
        const [index, ...keyPath] = path;
        if (keyPath.length === 0) {
          deletedItems.push(String(index));
        }
      }
    }

    notifyChanges(...addedItems, ...updatedItems);
  };

  subscribe(treeItems, syncTreeWithTreeItems);
}
