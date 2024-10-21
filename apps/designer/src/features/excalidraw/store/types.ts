import type { CustomExcalidrawElement } from "../../pipeline/store/canvas-elements/types";
import type {
  App,
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawElement,
  ExcalidrawElementSkeleton,
  ActionManager,
  ActionName,
  ExcalidrawModuleType,
} from "../types";

const customActions = [
  "imageExport",
  "jsonExport",
  "updateElements",
  "selectElements",
] as const;

export type CanvasActionName = ActionName | (typeof customActions)[number];

export interface CanvasAction {
  enabled: boolean;
  checked?: boolean;
  run: (value?: unknown) => void;
}

export interface UnavailableCanvasAction {
  enabled: boolean;
  checked?: boolean;
  run: (value?: unknown) => void;
}

export type ElementUpdate<
  TElement extends ExcalidrawElement = ExcalidrawElement,
> = Omit<Partial<TElement>, "id" | "version" | "versionNonce">;

export type ElementUpdates = Record<string, ElementUpdate>;

export type UpdateElementsForm =
  | {
      updates: ElementUpdates;
      changeVersion?: boolean;
      commitToHistory?: boolean;
    }
  | {
      elementIds: string[];
      updateData: ElementUpdate;
      changeVersion?: boolean;
      commitToHistory?: boolean;
    }
  | {
      elements: ExcalidrawElement[];
      changeVersion?: boolean;
      commitToHistory?: boolean;
    };

export interface ExcalidrawActions {
  getAction: (name: CanvasActionName) => CanvasAction | UnavailableCanvasAction;
  runAction: (name: CanvasActionName, value: unknown) => void;
  registerCustomActions: () => void;
  syncActionsWithAppState: () => void;
}

export const propertiesToSync = [
  "draggingElement",
  "editingElement",
  "editingLinearElement",
  "selectedElementIds",
  "previousSelectedElementIds",
  "selectedElementsAreBeingDragged",
  "startBoundElement",
  "suggestedBindings",
  "editingLinearElement",
  "selectionElement",
  "selectedLinearElement",
] as const;

export type CanvasAppProperties = (typeof propertiesToSync)[number];
export type CanvasAppState = Pick<AppState, CanvasAppProperties>;

export type ElementPosition =
  | { clientX: number; clientY: number }
  | "cursor"
  | "center";

export interface ElementRef<T extends ExcalidrawElement = ExcalidrawElement> {
  id: string;
  isStaged?: boolean;
  readonly element: T;
}

export interface ElementRefs<T extends ExcalidrawElement = ExcalidrawElement> {
  refs: ElementRef<T>[];
  hasRef: (refOrId: ElementRef<T> | string) => boolean;
  removeRef: (refOrId: ElementRef<T> | string) => boolean;
  addRef: (ref: ElementRef<T>) => void;
  refsCount: () => number;
  readonly elements: T[];
  readonly elementIds: string[];
}

export interface ElementsStore {
  state: {
    changes: {
      added: ElementRef[];
      deleted: ElementRef[];
      removed: ElementRef[];
      updated: ElementRef[];
    };
  };
  actions: {
    syncElements: (elements: readonly ExcalidrawElement[]) => void;

    addStaged: <T extends ExcalidrawElement>(
      elements: readonly T[],
    ) => ElementRef<T>[];

    clear: () => void;

    getRef: <T extends ExcalidrawElement>(elementId: string) => ElementRef<T>;

    getRefs: <T extends ExcalidrawElement>(
      elementId: string[],
    ) => ElementRef<T>[];

    getElement: (id: string) => ExcalidrawElement | undefined;

    getElements: (
      ids: string[] | AppState["selectedElementIds"],
    ) => ExcalidrawElement[];
  };
}

export interface ExcalidrawAPI {
  state: {
    imperativeApi?: ExcalidrawImperativeAPI;

    app?: App;
    isConnected?: boolean;
    hasRedoHistory: boolean;

    appState: CanvasAppState;
  };
  actions: {
    attachExcalidraw: (
      app: App,
      imperativeApi: ExcalidrawImperativeAPI,
      moduleExports: ExcalidrawModuleType,
    ) => void;

    detachExcalidraw: () => void;

    syncAppState: (freshAppState: AppState) => void;

    getApp: () => App;

    getImperativeApi: () => ExcalidrawImperativeAPI;

    getActionManager: () => ActionManager;

    addElements: (
      elements: ExcalidrawElement[],
      position: ElementPosition,
    ) => void;

    insertElement: (element: ExcalidrawElement) => void;

    convert: (
      elementsSkeleton: ExcalidrawElementSkeleton[] | null,
      opts?: {
        regenerateIds: boolean;
      },
    ) => ExcalidrawElement[];

    newElement: <T extends ExcalidrawElement>(
      element: T,
      updates: ElementUpdate<T>,
    ) => T;

    updateElements: (formData: UpdateElementsForm) => void;

    updateElementsInPlace: <
      T extends ExcalidrawElement = ExcalidrawElement,
    >(options: {
      elementsOrIds: string[] | ExcalidrawElement[];
      updateData: ElementUpdate<T>;
    }) => void;

    updateElementInPlace: <
      T extends ExcalidrawElement = ExcalidrawElement,
    >(options: {
      elementOrId: string | ExcalidrawElement;
      updateData: ElementUpdate<T>;
    }) => void;

    getSelectedElements: (
      selectedElementIds?: AppState["selectedElementIds"],
    ) => ExcalidrawElement[];

    getSelectedCustomElements: (
      elementIds?: AppState["selectedElementIds"],
    ) => CustomExcalidrawElement[];

    getElements: (ids: string[]) => ExcalidrawElement[];

    getElement: <T extends ExcalidrawElement>(id: string) => T | undefined;

    setToast: (
      toast: Parameters<ExcalidrawImperativeAPI["setToast"]>[0],
    ) => void;
  };
}

export interface ExcalidrawStore {
  state: {
    excalidraw: ExcalidrawAPI;
    excalidrawActions: ExcalidrawActions;
    elementsStore: ElementsStore;
  };

  actions: {
    connect: (
      app: App,
      imperativeApi: ExcalidrawImperativeAPI,
      moduleExports: ExcalidrawModuleType,
    ) => void;

    disconnect: () => void;
  };
}

export interface ExcalidrawContext extends Record<string, unknown> {
  excalidraw: ExcalidrawAPI;
  excalidrawActions: ExcalidrawActions;
  elementsStore: ElementsStore;
}
