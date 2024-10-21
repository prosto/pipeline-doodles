import type { TreeItemIndex } from "react-complex-tree";
import { proxy } from "valtio";

import { treeDataProviderFactory } from "@/features/complex-tree/tree-data-provider";
import type { PipelineDocumentStoreElement } from "@/features/pipeline/store/canvas-elements/types";
import { storeContext } from "@/features/pipeline/store/store-context";
import type { PipelineDocumentStore } from "@/features/pipeline-graph/types";
import { subscribeMap } from "@/features/store-utils";

import { treeItemEditorFactory } from "./tree-item-editor";
import { treeItemElementsFactory } from "./tree-item-elements";
import { treeItemFactory, treeItemsWrapper } from "./tree-item-factory";
import type {
  TreeItemDocumentStoreData,
  TreeItemRoot,
  DocumentStoreTreeItemData,
  DocumentStoreTreeItems,
  DocumentStoreTree,
  TreeItemDocumentStorePropertyData,
} from "./types";

export function documentStoreTreeItemsFactory(): DocumentStoreTree {
  const { canvasElements } = storeContext.useX();

  const {
    state: { documentStores: canvasDocumentStores },
  } = canvasElements;

  const treeItems: DocumentStoreTreeItems = {};
  const wrapper = treeItemsWrapper(treeItems);

  const treeState = proxy({
    hasItems: false,
  });

  const { dataProvider, notifyChanges } =
    treeDataProviderFactory<DocumentStoreTreeItemData>(treeItems);

  treeItems.root = treeItemFactory<TreeItemRoot>({
    index: "root",
    children: [],
    isFolder: true,
    data: {
      type: "root",
      title: "Components",
    },
  });

  subscribeMap<string, PipelineDocumentStoreElement>(
    canvasDocumentStores.state.documentStores,
    {
      onAdded(documentStoreId, documentStoreElement) {
        const {
          state: { isStaged },
        } = documentStoreElement;

        if (isStaged) {
          return;
        }

        createDocumentStoreTreeItems(documentStoreElement);
        treeState.hasItems = true;
        notifyChanges(documentStoreId);
      },
    },
  );

  function createDocumentStoreTreeItems(
    documentStoreElement: PipelineDocumentStoreElement,
  ): void {
    const { documentStore } = documentStoreElement.state;
    const { name: nodeName, id: documentStoreId } = documentStore.state;

    const initIndex = initProperties(documentStore);
    const elementIndex = documentStoreCanvasElements(documentStoreElement);

    const treeItem = treeItemFactory<TreeItemDocumentStoreData>({
      index: documentStoreId,
      children: [initIndex, elementIndex],
      isFolder: true,
      data: {
        type: "document-store",
        title: nodeName,
        documentStore: documentStoreElement,
      },
    });

    wrapper.addTreeItems([treeItem]);
  }

  function initProperties(documentStore: PipelineDocumentStore): TreeItemIndex {
    const {
      name: nodeName,
      id: documentStoreId,
      schemaNode,
    } = documentStore.state;

    return treeItemEditorFactory({
      itemId: documentStoreId,
      title: "init_parameters",
      children: treeItemDocumentStoreProperties(documentStore),
      treeItems,
      canEdit: true,
      schemaNode: schemaNode.init,
      dataPointer: {
        nodeName,
        nodeType: "documentStores",
        paramsType: "init",
      },
    });
  }

  function documentStoreCanvasElements(
    documentStoreElement: PipelineDocumentStoreElement,
  ): TreeItemIndex {
    const { id: itemId, elementRefs } = documentStoreElement.state;
    return treeItemElementsFactory({
      itemId,
      elements: elementRefs.elements,
      treeItems,
    });
  }

  function treeItemDocumentStoreProperties(
    documentStore: PipelineDocumentStore,
  ): TreeItemIndex[] {
    const { id, schemaNode } = documentStore.state;
    const properties: TreeItemIndex[] = [];

    for (const { propertyName, descriptor } of schemaNode.init.properties) {
      const index = `${id}-init-${propertyName}`;
      properties.push(index);

      treeItems[index] = treeItemFactory<TreeItemDocumentStorePropertyData>({
        index,
        data: {
          name: propertyName,
          type: "document-store-property",
          pyType: descriptor.pyTypeSimple,
        },
      });
    }

    return properties;
  }

  return { treeItems, treeState, dataProvider };
}
