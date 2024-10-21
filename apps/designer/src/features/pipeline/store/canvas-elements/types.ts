import type {
  ElementRef,
  ElementRefs,
  ExcalidrawAPI,
} from "@/features/excalidraw/store/types";
import type {
  ExcalidrawArrowElement,
  ExcalidrawElement,
  ExcalidrawLinearElement,
  ExcalidrawElementSkeleton,
} from "@/features/excalidraw/types";
import type {
  SchemaNodeComponent,
  SchemaNodeDocumentStore,
} from "@/features/json-schema-reflection";
import type {
  ConnectionSocket,
  PipelineConnection,
  PipelineDocumentStore,
  PipelineGraph,
  PipelineComponent,
} from "@/features/pipeline-graph/types";

import type { PipelineEditorStoreContext } from "../types";

import type {
  ComponentElementWrapper,
  ConnectionElementWrapper,
  DocumentStoreElementWrapper,
  WrapperFactory,
} from "./element-wrappers/types";

type KeysOfUnion<T> = T extends T ? keyof T : never;
type ElementProps = KeysOfUnion<ExcalidrawElement>;
type BindingProps = Partial<Record<ElementProps, string>>;

export interface GenericCustomData {
  id?: string;
  prevElementId?: string;
  status?: "ready" | "staged" | "attach";
}

export interface ComponentCustomData extends GenericCustomData {
  type: "component";
  schemaId: string;
  binding?: BindingProps;
}

export interface DocumentStoreCustomData extends GenericCustomData {
  type: "document-store";
  schemaId: string;
  binding?: BindingProps;
}

export interface ConnectionCustomData extends GenericCustomData {
  type: "connection";
  sourceProperty?: string;
  targetProperty?: string;
  binding?: BindingProps;
}

export type ElementCustomData =
  | ComponentCustomData
  | ConnectionCustomData
  | DocumentStoreCustomData;

export type CustomExcalidrawElement<
  E extends ExcalidrawElement = ExcalidrawElement,
  T extends ElementCustomData = ElementCustomData,
> = E & {
  customData: T;
};

export type ConnectionExcalidrawElement = CustomExcalidrawElement<
  ExcalidrawElement,
  ConnectionCustomData
>;

export type ConnectionLinearElement = CustomExcalidrawElement<
  ExcalidrawLinearElement,
  ConnectionCustomData
>;

export type ComponentExcalidrawElement = CustomExcalidrawElement<
  ExcalidrawElement,
  ComponentCustomData
>;

export type DocumentStoreExcalidrawElement = CustomExcalidrawElement<
  ExcalidrawElement,
  DocumentStoreCustomData
>;

export type CustomExcalidrawElementSkeleton = Omit<
  ExcalidrawElementSkeleton,
  "customData"
> & {
  customData: ElementCustomData;
};

export interface PipelineComponentElement {
  state: {
    id: string;
    nodeId: PipelineComponent["state"]["id"];
    elementRefs: ElementRefs<ComponentExcalidrawElement>;

    isStaged?: boolean;

    readonly node: PipelineComponent;
  };
  actions: {
    attachElement: (ref: ElementRef<ComponentExcalidrawElement>) => void;

    detachElement: (ref: ElementRef<ComponentExcalidrawElement>) => number;

    selectElements: () => void;
  };
}

export interface PipelineDocumentStoreElement {
  state: {
    id: string;
    documentStoreId: PipelineDocumentStore["state"]["id"];
    elementRefs: ElementRefs<DocumentStoreExcalidrawElement>;

    isStaged?: boolean;

    readonly documentStore: PipelineDocumentStore;
  };
  actions: {
    attachElement: (ref: ElementRef<DocumentStoreExcalidrawElement>) => void;

    detachElement: (ref: ElementRef<DocumentStoreExcalidrawElement>) => number;

    selectElements: () => void;
  };
}

export interface PipelineConnectionElement {
  state: {
    id: string;
    connectionId: PipelineConnection["state"]["id"];
    arrowElement: ConnectionExcalidrawElement;

    readonly connection: PipelineConnection;
    readonly sourceSocket: ConnectionSocket;
    readonly targetSocket: ConnectionSocket;
  };
  actions: {
    selectElements: () => void;
  };
}

export interface CanvasElements {
  state: {
    connections: CanvasConnections;
    components: CanvasComponents;
    documentStores: CanvasDocumentStores;
    elementWrapper: WrapperFactory;
  };
  actions: {
    selectElements: (elements: ExcalidrawElement[]) => void;
  };
}

interface ChangeHandlers<T> {
  handleUpdated: (elementWrappers: T[]) => void;
  handleAdded: (elementWrappers: T[]) => void;
  handleDeleted: (elementWrappers: T[]) => void;
  handleRemoved: (elementWrappers: T[]) => void;
}

export interface CanvasConnections {
  state: {
    connections: Map<string, PipelineConnectionElement>;
  };
  actions: ChangeHandlers<ConnectionElementWrapper> & {
    attachConnectionDataToArrow: ({
      arrowElement,
      sourceProperty,
      targetProperty,
    }: {
      arrowElement: ExcalidrawArrowElement;
      sourceProperty?: string;
      targetProperty?: string;
    }) => void;

    removeConnectionData: (arrowElement: ExcalidrawArrowElement) => void;

    getConnectionById: (
      id: PipelineConnectionElement["state"]["id"],
    ) => PipelineConnectionElement | undefined;

    hasConnectionWithElementId: (elementId: ExcalidrawElement["id"]) => boolean;

    getConnectionByElementId: (
      elementId: ExcalidrawElement["id"],
    ) => PipelineConnectionElement | undefined;
  };
}

export interface CanvasComponents {
  state: {
    components: Map<string, PipelineComponentElement>;
    readonly size: number;
  };
  actions: ChangeHandlers<ComponentElementWrapper> & {
    createFromSchema: (
      schemaNode: SchemaNodeComponent,
      elementRefs: ElementRef<ComponentExcalidrawElement>[],
      isStaged?: boolean,
    ) => PipelineComponentElement;

    getComponentByElementId: (
      elementId: ExcalidrawElement["id"],
    ) => PipelineComponentElement | undefined;

    hasComponentWithElementId: (elementId: ExcalidrawElement["id"]) => boolean;

    getComponentsByElementIds: (
      elementIds: ExcalidrawElement["id"][],
    ) => PipelineComponentElement[];

    getComponentByNodeId: (
      nodeId: PipelineComponent["state"]["id"],
    ) => PipelineComponentElement | undefined;

    getComponentsByNodeIds: (
      nodeIds: PipelineComponent["state"]["id"][],
    ) => PipelineComponentElement[];

    getComponentById: (
      id: PipelineComponentElement["state"]["id"],
    ) => PipelineComponentElement | undefined;

    getComponentsByIds: (ids: string[]) => PipelineComponentElement[];

    getAllComponents: () => PipelineComponentElement[];
  };
}

export interface CanvasDocumentStores {
  state: {
    documentStores: Map<string, PipelineDocumentStoreElement>;
  };
  actions: ChangeHandlers<DocumentStoreElementWrapper> & {
    createFromSchema: (
      schemaNode: SchemaNodeDocumentStore,
      elementRefs: ElementRef<DocumentStoreExcalidrawElement>[],
      isStaged?: boolean,
    ) => PipelineDocumentStoreElement;
  };
}

export interface CanvasElementsContext {
  connections: CanvasConnections;
  components: CanvasComponents;
  pipelineGraph: PipelineGraph;
  excalidraw: ExcalidrawAPI;
}

export interface CanvasContext extends PipelineEditorStoreContext {
  connections: CanvasConnections;
  components: CanvasComponents;
  documentStores: CanvasDocumentStores;
  elementWrapper: WrapperFactory;
}
