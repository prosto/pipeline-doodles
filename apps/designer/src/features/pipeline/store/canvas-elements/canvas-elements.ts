import { subscribe } from "valtio";

import type { ElementRef } from "@/features/excalidraw/store/types";

import { storeContext } from "../store-context";

import { canvasComponentsFactory } from "./canvas-components";
import { canvasConnectionsFactory } from "./canvas-connections";
import { canvasContext } from "./canvas-context";
import { canvasDocumentStoreFactory } from "./canvas-document-stores";
import type {
  ComponentElementWrapper,
  ConnectionElementWrapper,
  DocumentStoreElementWrapper,
} from "./element-wrappers/types";
import { wrapperFactory } from "./element-wrappers/wrapper-factory";
import {
  isComponentElementRef,
  isConnectionLinearElementRef,
  isDocumentStoreElement,
} from "./type-utils";
import type {
  CanvasElements,
  ComponentExcalidrawElement,
  ConnectionLinearElement,
  DocumentStoreExcalidrawElement,
} from "./types";

interface ChangesPerElementType {
  connection: ConnectionElementWrapper[];
  component: ComponentElementWrapper[];
  documentStore: DocumentStoreElementWrapper[];
}

export function canvasElementsFactory(): CanvasElements {
  const {
    excalidrawStore,
    components,
    connections,
    documentStores,
    elementWrapper,
  } = canvasContext.extend(storeContext, (bind) => {
    bind("components", canvasComponentsFactory);
    bind("connections", canvasConnectionsFactory);
    bind("documentStores", canvasDocumentStoreFactory);
    bind("elementWrapper", wrapperFactory);
  });

  const { elementsStore, excalidrawActions } = excalidrawStore.state;

  const {
    actions: { hasConnectionWithElementId },
  } = connections;

  const {
    actions: { hasComponentWithElementId },
  } = components;

  const state: CanvasElements["state"] = {
    components,
    connections,
    documentStores,
    elementWrapper,
  };

  function changesPerElementType(refs: ElementRef[]): ChangesPerElementType {
    const changesPerType: ChangesPerElementType = {
      connection: [],
      component: [],
      documentStore: [],
    };

    for (const ref of refs) {
      if (isComponentElementRef(ref) || hasComponentWithElementId(ref.id)) {
        changesPerType.component.push(
          elementWrapper.component(
            ref as ElementRef<ComponentExcalidrawElement>,
          ),
        );
      } else if (
        isConnectionLinearElementRef(ref) ||
        hasConnectionWithElementId(ref.id)
      ) {
        changesPerType.connection.push(
          elementWrapper.connection(ref as ElementRef<ConnectionLinearElement>),
        );
      } else if (isDocumentStoreElement(ref.element)) {
        changesPerType.documentStore.push(
          elementWrapper.documentStore(
            ref as ElementRef<DocumentStoreExcalidrawElement>,
          ),
        );
      }
    }

    return changesPerType;
  }

  subscribe(elementsStore.state.changes, () => {
    const { changes } = elementsStore.state;

    if (changes.added.length > 0) {
      const addedPerType = changesPerElementType(changes.added);
      documentStores.actions.handleAdded(addedPerType.documentStore);
      components.actions.handleAdded(addedPerType.component);
      connections.actions.handleAdded(addedPerType.connection);
    }

    if (changes.updated.length > 0) {
      const updatedPerType = changesPerElementType(changes.updated);
      documentStores.actions.handleUpdated(updatedPerType.documentStore);
      components.actions.handleUpdated(updatedPerType.component);
      connections.actions.handleUpdated(updatedPerType.connection);
    }

    if (changes.removed.length > 0) {
      const removedPerType = changesPerElementType(changes.removed);
      documentStores.actions.handleRemoved(removedPerType.documentStore);
      components.actions.handleRemoved(removedPerType.component);
      connections.actions.handleRemoved(removedPerType.connection);
    }
  });

  const actions: CanvasElements["actions"] = {
    selectElements(elements) {
      excalidrawActions.runAction("selectElements", elements);
    },
  };

  return {
    state,
    actions,
  };
}
