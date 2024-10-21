import * as registry from "@repo/node-specs/registry";
import type {
  NodeJsonSchema,
  SchemaBundle,
  SchemaId,
} from "@repo/node-specs/types";
import { ensureIsDefined } from "@repo/shared/utils";
import type { TreeItemIndex } from "react-complex-tree";

import type { ExTreeDataProvider, PresetTreeItem } from "./types";

export function schemaTreeItem(schema: NodeJsonSchema): PresetTreeItem {
  return {
    index: schema.$id,
    data: {
      type: "schema",
      title: schema.title,
      schema,
      canDrag: true,
    },
    isFolder: false,
    canMove: false,
    canRename: false,
  };
}

function schemaFilter(schemaOrBundle: NodeJsonSchema | SchemaBundle): boolean {
  if (registry.isBundle(schemaOrBundle)) {
    return true;
  }

  return schemaOrBundle.__nodeType !== "protocol";
}

export function schemaBundleTreeItem(
  bundle: SchemaBundle | SchemaId,
): PresetTreeItem {
  const resolvedBundle =
    typeof bundle === "string"
      ? ensureIsDefined(registry.getBundle(bundle))
      : bundle;

  return {
    index: resolvedBundle.$id,
    children: resolvedBundle.schemas
      .filter(schemaFilter)
      .map((schemaOrBundle) => schemaOrBundle.$id),
    data: {
      type: "schema-bundle",
      title: resolvedBundle.title,
      bundle: resolvedBundle,
      canDrag: false,
    },
    isFolder: true,
    canMove: false,
    canRename: false,
  };
}

export function schemaDataProvider(): ExTreeDataProvider {
  function getTreeItem(itemId: TreeItemIndex): Promise<PresetTreeItem> {
    return Promise.resolve(getTreeItemSync(itemId));
  }

  function getTreeItemSync(itemId: TreeItemIndex): PresetTreeItem {
    const schema = registry.getSchema<NodeJsonSchema>(itemId as SchemaId);
    if (schema) {
      return schemaTreeItem(schema);
    }

    const bundle = registry.getBundle(itemId as SchemaId);
    if (bundle) {
      return schemaBundleTreeItem(bundle);
    }

    throw new Error(
      `Could not find either schema or schema bundle with id: ${itemId}`,
    );
  }

  return {
    getTreeItem,
    getTreeItemSync,
  };
}
