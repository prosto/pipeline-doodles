import type { ElementRef } from "@/features/excalidraw/store/types";
import type {
  ConnectionSocket,
  MatchingSocketsView,
} from "@/features/pipeline-graph/types";

import type { PipelineComponentElement } from "../canvas-elements/types";

export interface StaticEditingConnectionState {
  isConnecting: boolean;
  isBinding: boolean;

  sourceComponentId?: string;
  targetComponentId?: string;

  startOutOfBounds?: boolean;
  endOutOfBounds?: boolean;

  startComponent?: PipelineComponentElement | null;
  endComponent?: PipelineComponentElement | null;
  suggestedComponent?: PipelineComponentElement | null;
  prevSuggestedComponent?: PipelineComponentElement | null;

  startElementId: string | null;
  endElementId: string | null;

  sourceElement: ElementRef | null;
  targetElement: ElementRef | null;

  sourceType: "output" | "input";
  matchingSockets: MatchingSocketsView | null;
  sourceSocket: ConnectionSocket | null;
  targetSocket: ConnectionSocket | null;
}

export interface ComputedEditingConnectionState {
  readonly sourceComponent?: PipelineComponentElement;
  readonly targetComponent?: PipelineComponentElement;
  readonly targetElementIds: string[];
  readonly matchingComponents: PipelineComponentElement[];
  readonly matchingElementIds: string[];
}

export interface EditingConnection {
  state: StaticEditingConnectionState & ComputedEditingConnectionState;
}
