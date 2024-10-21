import { mapOfSets } from "@repo/shared/utils";
import { uniqBy } from "lodash-es";
import { proxyMap } from "valtio/utils";

import type { ElementRef } from "@/features/excalidraw/store/types";
import type { ExcalidrawElement } from "@/features/excalidraw/types";
import type { SchemaNodeComponent } from "@/features/json-schema-reflection";
import { schemaTypeReflection } from "@/features/json-schema-reflection";
import type { PipelineComponent } from "@/features/pipeline-graph/types";

import { canvasContext } from "./canvas-context";
import type { ComponentElementWrapper } from "./element-wrappers/types";
import { componentElement } from "./elements/component-element";
import type {
  CanvasComponents,
  ComponentExcalidrawElement,
  PipelineComponentElement,
} from "./types";

export function canvasComponentsFactory(): CanvasComponents {
  const { pipelineGraph } = canvasContext.useX();
  const createComponentElement = canvasContext.wrapFn(componentElement);

  const components = proxyMap<
    PipelineComponentElement["state"]["id"],
    PipelineComponentElement
  >();

  const nodeToComponent = new Map<
    PipelineComponent["state"]["id"],
    PipelineComponentElement["state"]["id"]
  >();

  const elementToComponent = new Map<
    ExcalidrawElement["id"],
    PipelineComponentElement["state"]["id"]
  >();

  const state = {
    components,

    get size() {
      return components.size;
    },
  };

  function removeComponent(component: PipelineComponentElement): void {
    const { id: componentId, nodeId } = component.state;
    nodeToComponent.delete(nodeId);
    components.delete(componentId);
    pipelineGraph.actions.removeComponent(nodeId);
  }

  function addElementRefToComponent(
    componentId: string,
    ref: ElementRef<ComponentExcalidrawElement>,
  ): void {
    const component = components.get(componentId);
    if (component) {
      component.actions.attachElement(ref);
      elementToComponent.set(ref.id, componentId);
    }
  }

  const actions: CanvasComponents["actions"] = {
    createFromSchema(
      schemaNode,
      elementRefs,
      isStaged = false,
    ): PipelineComponentElement {
      const component = pipelineGraph.actions.addComponent(schemaNode);
      const nodeId = component.state.id;

      const newComponent = createComponentElement({
        component,
        elementRefs,
        isStaged,
      });
      const componentId = newComponent.state.id;

      components.set(componentId, newComponent);
      nodeToComponent.set(nodeId, componentId);
      elementRefs.forEach(({ id }) => elementToComponent.set(id, componentId));

      return newComponent;
    },

    handleAdded(elementWrappers: ComponentElementWrapper[]): void {
      const elementsBySchemaAndId = mapOfSets<
        string,
        ElementRef<ComponentExcalidrawElement>
      >();

      for (const wrapper of elementWrappers) {
        const { customId, elementId, status, schemaId } = wrapper;
        if (
          customId &&
          components.has(customId) &&
          !elementToComponent.has(elementId) &&
          (status === "staged" || status === "attach")
        ) {
          addElementRefToComponent(customId, wrapper.elementRef);
        } else {
          const dataKey = `${schemaId}:::${customId}`;
          elementsBySchemaAndId.addValue(dataKey, wrapper.elementRef);
        }
      }

      for (const [dataKey, refs] of elementsBySchemaAndId.normEntries()) {
        const [schemaId] = dataKey.split(":::");

        void schemaTypeReflection
          .buildReflectionTree(schemaId)
          .then((schemaNode) =>
            actions.createFromSchema(schemaNode as SchemaNodeComponent, refs),
          );
      }
    },

    handleUpdated(_elementWrappers: ComponentElementWrapper[]): void {
      // TODO
    },

    handleDeleted(_elementWrappers: ComponentElementWrapper[]): void {
      // TODO
    },

    handleRemoved(elementWrappers: ComponentElementWrapper[]): void {
      for (const { component, elementRef } of elementWrappers) {
        if (component) {
          if (component.actions.detachElement(elementRef) <= 0) {
            removeComponent(component);
          }
          elementToComponent.delete(elementRef.id);
        }
      }
    },

    getComponentsByElementIds(
      elementIds: string[],
    ): PipelineComponentElement[] {
      const foundComponents = elementIds
        .map((elementId) => actions.getComponentByElementId(elementId))
        .filter((item): item is PipelineComponentElement => Boolean(item));

      return uniqBy(foundComponents, ({ state: { id } }) => id);
    },

    hasComponentWithElementId(elementId: ExcalidrawElement["id"]) {
      return elementToComponent.has(elementId);
    },

    getComponentByElementId(elementId: ExcalidrawElement["id"]) {
      const componentId = elementToComponent.get(elementId);
      return componentId ? actions.getComponentById(componentId) : undefined;
    },

    getComponentByNodeId(nodeId: PipelineComponent["state"]["id"]) {
      const componentId = nodeToComponent.get(nodeId);
      return componentId ? actions.getComponentById(componentId) : undefined;
    },

    getComponentsByNodeIds(nodeIds: PipelineComponent["state"]["id"][]) {
      return nodeIds
        .map((id) => actions.getComponentByNodeId(id))
        .filter(
          (value): value is PipelineComponentElement => value !== undefined,
        );
    },

    getComponentById(id: PipelineComponentElement["state"]["id"]) {
      return components.get(id);
    },

    getComponentsByIds(ids: PipelineComponentElement["state"]["id"][]) {
      return ids
        .map((id) => actions.getComponentById(id))
        .filter(
          (value): value is PipelineComponentElement => value !== undefined,
        );
    },

    getAllComponents() {
      return Array.from(components.values());
    },
  };

  return {
    state,
    actions,
  };
}
