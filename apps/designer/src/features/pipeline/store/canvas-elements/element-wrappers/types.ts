import type { ElementRef } from "@/features/excalidraw/store/types";
import type { ExcalidrawTextElement } from "@/features/excalidraw/types";
import type {
  ConnectionSocket,
  PipelineGraph,
  PipelineComponent,
} from "@/features/pipeline-graph/types";

import type {
  CanvasComponents,
  CanvasConnections,
  ComponentExcalidrawElement,
  ConnectionLinearElement,
  DocumentStoreExcalidrawElement,
  PipelineConnectionElement,
  PipelineComponentElement,
} from "../types";

export interface WrapperFactoryContext {
  connections: CanvasConnections;
  components: CanvasComponents;
  pipelineGraph: PipelineGraph;
}

export interface WrapperFactory {
  connection: (
    elementRef: ElementRef<ConnectionLinearElement>,
  ) => ConnectionElementWrapper;

  component: (
    elementRef: ElementRef<ComponentExcalidrawElement>,
  ) => ComponentElementWrapper;

  documentStore: (
    elementRef: ElementRef<DocumentStoreExcalidrawElement>,
  ) => DocumentStoreElementWrapper;
}

export interface ConnectionElementWrapper {
  elementRef: ElementRef<ConnectionLinearElement>;
  readonly hasData: boolean;
  readonly element: ConnectionLinearElement;
  readonly elementId: string;
  readonly connectionId?: string;
  readonly connection?: PipelineConnectionElement;
  readonly sourceProperty?: string;
  readonly targetProperty?: string;

  readonly sourceElementId?: string;
  readonly sourceComponent?: PipelineComponentElement;
  readonly sourceNode?: PipelineComponent;
  readonly sourceSocket?: ConnectionSocket;
  readonly targetElementId?: string;
  readonly targetComponent?: PipelineComponentElement;
  readonly targetNode?: PipelineComponent;
  readonly targetSocket?: ConnectionSocket;

  readonly hasBoundText: boolean;
  readonly labelElement?: ExcalidrawTextElement;
}

export interface ComponentElementWrapper {
  elementRef: ElementRef<ComponentExcalidrawElement>;
  readonly elementId: string;
  readonly schemaId: string;
  readonly customId?: string;
  readonly status?: string;
  readonly componentId?: string;
  readonly component?: PipelineComponentElement;
  readonly node?: PipelineComponent;
}

export interface DocumentStoreElementWrapper {
  elementRef: ElementRef<DocumentStoreExcalidrawElement>;
  readonly elementId: string;
  readonly schemaId: string;
  readonly customId?: string;
  readonly status?: string;
  // readonly documentStoreId?: string;
  // readonly documentStore?: PipelineDocumentStoreElement;
}
