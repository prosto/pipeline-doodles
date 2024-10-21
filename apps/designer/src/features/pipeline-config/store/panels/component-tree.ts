import type { TreeItemIndex } from "react-complex-tree";
import { proxy } from "valtio";

import { treeDataProviderFactory } from "@/features/complex-tree/tree-data-provider";
import type { PipelineComponentElement } from "@/features/pipeline/store/canvas-elements/types";
import { storeContext } from "@/features/pipeline/store/store-context";
import type {
  ConnectionSocketWithState,
  NodeParamNames,
  PipelineComponent,
} from "@/features/pipeline-graph/types";
import { subscribeMap } from "@/features/store-utils";

import { treeItemEditorFactory } from "./tree-item-editor";
import { treeItemElementsFactory } from "./tree-item-elements";
import { treeItemFactory, treeItemsWrapper } from "./tree-item-factory";
import type {
  TreeItemRoot,
  ComponentTreeItemData,
  ComponentTreeItems,
  TreeItemComponentData,
  ComponentTree,
  TreeItemComponentPropertyData,
} from "./types";

export function componentTreeItemsFactory(): ComponentTree {
  const {
    canvasElements,
    pipelineGraph: {
      state: { sockets },
    },
  } = storeContext.useX();

  const {
    state: { components: canvasComponents },
  } = canvasElements;

  const treeItems: ComponentTreeItems = {};
  const wrapper = treeItemsWrapper(treeItems);

  const treeState = proxy({
    hasComponents: false,
  });

  const { dataProvider, notifyChanges } =
    treeDataProviderFactory<ComponentTreeItemData>(treeItems);

  treeItems.root = treeItemFactory<TreeItemRoot>({
    index: "root",
    children: [],
    isFolder: true,
    data: {
      type: "root",
      title: "Components",
    },
  });

  subscribeMap<string, PipelineComponentElement>(
    canvasComponents.state.components,
    {
      onAdded(componentId, componentElement) {
        const {
          state: { isStaged },
        } = componentElement;

        if (isStaged) {
          return;
        }

        createComponentTreeItems(componentElement);

        treeState.hasComponents = true;
        notifyChanges("root", componentId);
      },
    },
  );

  function createComponentTreeItems(
    componentElement: PipelineComponentElement,
  ): void {
    const { node: component } = componentElement.state;
    const { name: nodeName, id: componentId } = component.state;

    const initIndex = initProperties(component);
    const inputIndex = inputProperties(component);
    const outputIndex = outputProperties(component);
    const elementIndex = componentCanvasElements(componentElement);

    const children = [initIndex, inputIndex, outputIndex, elementIndex];

    const componentTreeItem = treeItemFactory<TreeItemComponentData>({
      index: componentId,
      children,
      isFolder: true,
      data: {
        type: "component",
        title: nodeName,
        component: componentElement,
      },
    });

    wrapper.addTreeItems([componentTreeItem]);
    notifyChanges(componentId, ...children);
  }

  function initProperties(component: PipelineComponent): TreeItemIndex {
    const { name: nodeName, id: componentId, schemaNode } = component.state;

    return treeItemEditorFactory({
      treeItems,
      children: treeItemComponentProperties(component, "init"),
      itemId: componentId,
      title: "init_parameters",
      canEdit: true,
      schemaNode: schemaNode.init,
      dataPointer: {
        nodeName,
        nodeType: "components",
        paramsType: "init",
      },
    });
  }

  function inputProperties(component: PipelineComponent): TreeItemIndex {
    const { name: nodeName, id: componentId, schemaNode } = component.state;
    return treeItemEditorFactory({
      itemId: componentId,
      title: "input",
      canEdit: true,
      children: treeItemComponentProperties(component, "input"),
      treeItems,
      schemaNode: schemaNode.input,
      dataPointer: {
        nodeName,
        nodeType: "components",
        paramsType: "input",
      },
    });
  }

  function outputProperties(component: PipelineComponent): TreeItemIndex {
    const { name: nodeName, id: componentId, schemaNode } = component.state;
    return treeItemEditorFactory({
      itemId: componentId,
      title: "output",
      children: treeItemComponentProperties(component, "output"),
      treeItems,
      schemaNode: schemaNode.output,
      dataPointer: {
        nodeName,
        nodeType: "components",
        paramsType: "output",
      },
    });
  }

  function treeItemComponentProperties(
    component: PipelineComponent,
    paramsType: NodeParamNames,
  ): TreeItemIndex[] {
    const { id: componentId, schemaNode } = component.state;
    const properties: TreeItemIndex[] = [];

    for (const { propertyName, descriptor } of schemaNode[paramsType]
      .properties) {
      const index = `${componentId}-${paramsType}-${propertyName}`;
      const socket = sockets.getSocketForNode<ConnectionSocketWithState>(
        paramsType,
        componentId,
        propertyName,
      );

      treeItems[index] = treeItemFactory<TreeItemComponentPropertyData>({
        index,
        data: {
          name: propertyName,
          type: "component-property",
          pyType: descriptor.pyTypeSimple,
          socket,
        },
      });

      properties.push(index);
    }

    return properties;
  }

  function componentCanvasElements(
    componentElement: PipelineComponentElement,
  ): TreeItemIndex {
    const { id: itemId, elementRefs } = componentElement.state;
    return treeItemElementsFactory({
      itemId,
      elements: elementRefs.elements,
      treeItems,
    });
  }

  return { treeItems, dataProvider, treeState };
}
