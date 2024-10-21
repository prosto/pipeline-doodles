import { ensureIsDefined } from "@repo/shared/utils";
import { assign, assignWith, get, merge, pick } from "lodash-es";
import { proxy, ref } from "valtio";

import type {
  ExcalidrawBindableElement,
  ExcalidrawElement,
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawModuleType,
  ActionName,
} from "../types";

import { isCustomExcalidrawElement } from "./type-utils";
import type {
  CanvasAppProperties,
  CanvasAppState,
  ElementPosition,
  ExcalidrawAPI,
} from "./types";
import { propertiesToSync } from "./types";

export function appStateSelector(appState: AppState): CanvasAppState {
  return pick<AppState, CanvasAppProperties>(appState, ...propertiesToSync);
}

const defaultCanvasAppState: CanvasAppState = proxy({
  draggingElement: null,
  editingElement: null,
  editingGroupId: null,
  editingLinearElement: null,
  selectedElementIds: {},
  previousSelectedElementIds: {},
  selectedGroupIds: {},
  selectedElementsAreBeingDragged: false,
  startBoundElement: null,
  suggestedBindings: [],
  elementsToHighlight: null,
  selectionElement: null,
  selectedLinearElement: null,
  activeTool: {
    type: "selection",
    customType: null,
    locked: false,
    lastActiveTool: null,
  },
});

export function excalidrawAPI(): ExcalidrawAPI {
  const disconnectedExcalidrawAPI = {
    imperativeApi: undefined,

    app: undefined,
    isConnected: false,
    hasRedoHistory: false,

    appState: defaultCanvasAppState,
  };

  let excalidrawExports: ExcalidrawModuleType;

  const state = proxy<ExcalidrawAPI["state"]>(disconnectedExcalidrawAPI);

  const canvasAppState = state.appState;

  function bindableElementIds(bindings: AppState["suggestedBindings"]): string {
    return bindings
      .filter(
        (binding): binding is ExcalidrawBindableElement =>
          !Array.isArray(binding),
      )
      .map(({ id }) => id)
      .join("+");
  }

  function assignCustomizer<T = unknown>(
    objectValue: T,
    sourceValue: T,
    key: string,
  ): T | undefined {
    if (key === "suggestedBindings") {
      const currentBindings = bindableElementIds(
        objectValue as AppState["suggestedBindings"],
      );
      const suggestedBindings = bindableElementIds(
        sourceValue as AppState["suggestedBindings"],
      );
      if (currentBindings !== suggestedBindings) {
        return sourceValue;
      }
      return objectValue;
    }

    return undefined;
  }

  function hasRedoStack(): boolean {
    if (state.isConnected) {
      const redoStack = get(state.app, "history.redoStack", []);
      return redoStack.length > 0;
    }
    return false;
  }

  function runAction(name: ActionName, data: unknown): void {
    const actionManager = actions.getActionManager();
    const action = actionManager.actions[name as ActionName];
    actionManager.executeAction(action, "api", data);
  }

  const actions: ExcalidrawAPI["actions"] = {
    attachExcalidraw(app, imperativeApi, moduleExports) {
      excalidrawExports = moduleExports;

      state.app = ref(app);
      state.imperativeApi = ref(imperativeApi);
      state.isConnected = true;
    },

    detachExcalidraw() {
      assign(state, disconnectedExcalidrawAPI);
    },

    syncAppState(freshAppState) {
      assignWith(
        state.appState,
        appStateSelector(freshAppState),
        assignCustomizer,
      );

      state.hasRedoHistory = hasRedoStack();
    },

    getApp() {
      return ensureIsDefined(state.app);
    },

    getActionManager() {
      return actions.getApp().actionManager;
    },

    getImperativeApi() {
      return ensureIsDefined(state.imperativeApi);
    },

    addElements(elements: ExcalidrawElement[], position: ElementPosition) {
      actions.getApp().addElementsFromPasteOrLibrary({
        elements,
        position,
        files: null,
      });
    },

    insertElement(element: ExcalidrawElement) {
      actions.getApp().scene.addNewElement(element);
    },

    convert(elementsSkeleton, opts) {
      const { convertToExcalidrawElements } = excalidrawExports;
      return convertToExcalidrawElements(elementsSkeleton, opts);
    },

    newElement(element, updates) {
      const { newElementWith } = excalidrawExports;
      return newElementWith(element, updates);
    },

    updateElements(formData) {
      runAction("updateElements" as ActionName, formData);
    },

    updateElementsInPlace({ elementsOrIds, updateData }) {
      for (const element of elementsOrIds) {
        actions.updateElementInPlace({ elementOrId: element, updateData });
      }

      actions.getApp().scene.informMutation();
    },

    updateElementInPlace({ elementOrId, updateData }) {
      const element =
        typeof elementOrId === "string"
          ? actions.getElement(elementOrId)
          : elementOrId;

      if (element) {
        merge(element, updateData);
        // bumpVersion(element);
      }
    },

    getSelectedElements(elementIds?: AppState["selectedElementIds"]) {
      if (!state.isConnected) {
        return [];
      }

      const selectedElementIds =
        elementIds ?? canvasAppState.selectedElementIds;

      return actions.getApp().scene.getSelectedElements({
        selectedElementIds,
      });
    },

    getElements(ids: string[]) {
      return (
        state.imperativeApi
          ?.getSceneElements()
          .filter((el) => ids.includes(el.id)) ?? []
      );
    },

    getElement<T extends ExcalidrawElement>(id: string) {
      return actions.getApp().scene.getElement<T>(id) as T | undefined;
    },

    getSelectedCustomElements(elementIds?: AppState["selectedElementIds"]) {
      return actions
        .getSelectedElements(elementIds)
        .filter(isCustomExcalidrawElement);
    },

    setToast(toast: Parameters<ExcalidrawImperativeAPI["setToast"]>[0]) {
      state.imperativeApi?.setToast(toast);
    },
  };

  return {
    state,
    actions,
  };
}
