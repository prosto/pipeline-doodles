import type { NextChainFn, StopChainFn } from "@repo/shared/utils";
import { invocationChain, isDefined } from "@repo/shared/utils";
import { memoize } from "lodash-es";
import { proxy } from "valtio";

import { elementsUpdater } from "@/features/excalidraw";
import { isArrowElement } from "@/features/excalidraw/store/type-utils";
import type {
  ExcalidrawArrowElement,
  ExcalidrawBindableElement,
} from "@/features/excalidraw/types";
import type { ConnectionSocket } from "@/features/pipeline-graph/types";
import { subscribeKeys } from "@/features/store-utils";

import { isComponentElement } from "../canvas-elements/type-utils";
import type { PipelineComponentElement } from "../canvas-elements/types";
import { storeContext } from "../store-context";

import type { EditingConnection, StaticEditingConnectionState } from "./types";

interface BindingStateUpdate {
  isBinding?: boolean;
  sourceSocket?: ConnectionSocket | null;
  targetSocket?: ConnectionSocket | null;
}

interface ConnectingStateUpdate extends BindingStateUpdate {
  sourceElementId: string;
  sourceComponent: PipelineComponentElement;
  sourceType: "input" | "output";
}
interface ConnectingContext {
  isDragging: boolean;
  selectedArrowElement?: ExcalidrawArrowElement;
  suggestedComponents: PipelineComponentElement[];
}

export function editingConnectionFactory(): EditingConnection {
  const { excalidraw, excalidrawStore, canvasElements, pipelineGraph } =
    storeContext.useX();

  const {
    excalidraw: {
      state: { appState },
      actions: { getSelectedElements },
    },
    elementsStore: {
      actions: { getRef },
    },
  } = excalidrawStore.state;

  const {
    state: { components, connections, elementWrapper },
  } = canvasElements;

  const { getMatchingSocketsForNode, sameSocket } = pipelineGraph.state.sockets;

  const _getMatchingSocketsForNode = memoize(
    getMatchingSocketsForNode,
    (type, nodeId) => `${type}_${nodeId}`,
  );

  const {
    actions: {
      getComponentByElementId,
      getComponentsByElementIds,
      getComponentByNodeId,
      getComponentsByNodeIds,
    },
  } = components;

  const {
    actions: { attachConnectionDataToArrow, removeConnectionData },
  } = connections;

  const noConnectionState: Partial<StaticEditingConnectionState> = {
    isBinding: false,
    isConnecting: false,

    sourceElement: null,
    targetElement: null,

    sourceType: "output",
    matchingSockets: null,

    startOutOfBounds: false,
    endOutOfBounds: false,
    suggestedComponent: null,
    prevSuggestedComponent: null,
  };

  const noBindingState: Partial<StaticEditingConnectionState> = {
    isBinding: false,
    sourceSocket: null,
    targetSocket: null,
  };

  const defaultState = {
    ...noConnectionState,
    ...noBindingState,
  } as StaticEditingConnectionState;

  const state: EditingConnection["state"] = proxy<EditingConnection["state"]>({
    ...defaultState,

    get sourceComponent() {
      return state.sourceElement
        ? getComponentByElementId(state.sourceElement.id)
        : undefined;
    },

    get targetComponent() {
      return state.targetSocket
        ? getComponentByNodeId(state.targetSocket.nodeId)
        : undefined;
    },

    get targetElementIds() {
      return state.targetComponent?.state.elementRefs.elementIds ?? [];
    },

    get matchingComponents() {
      const nodeIds = state.matchingSockets?.getMatchingNodesCached() ?? [];
      return getComponentsByNodeIds(nodeIds);
    },

    get matchingElementIds() {
      return state.matchingComponents
        .map(({ state: { elementRefs } }) => elementRefs.elementIds)
        .flat();
    },
  });

  function updateState(data: Partial<StaticEditingConnectionState>): void {
    Object.assign(state, data);
  }

  function getBindableElements(): Map<string, ExcalidrawBindableElement> {
    return new Map(
      appState.suggestedBindings
        .filter(
          (binding): binding is ExcalidrawBindableElement =>
            !Array.isArray(binding),
        )
        .map((binding) => [binding.id, binding]),
    );
  }

  function prepareConnectingContext(
    context: ConnectingContext,
    nextFn: NextChainFn,
  ): void {
    const editingElement = appState.editingElement;
    const selectedElementIds = appState.selectedElementIds;
    const draggingElement = appState.draggingElement;

    const selectedArrows =
      getSelectedElements(selectedElementIds).filter(isArrowElement);

    if (isArrowElement(editingElement)) {
      context.selectedArrowElement = editingElement;
    } else if (selectedArrows.length === 1) {
      context.selectedArrowElement = selectedArrows[0];
    } else {
      // No need to continue as there is no selected SINGLE arrow to manage connections
      // All downstream chain functions will be skipped
      return;
    }

    context.isDragging = draggingElement !== null;

    const bindableElements = getBindableElements();
    const suggestedComponents = getComponentsByElementIds(
      Array.from(bindableElements.keys()),
    );

    state.prevSuggestedComponent = state.suggestedComponent;
    state.suggestedComponent =
      suggestedComponents.length === 1 ? suggestedComponents[0] : null;

    const { startBinding, endBinding } = context.selectedArrowElement;

    if (isDefined(startBinding)) {
      const startComponent = getComponentByElementId(startBinding.elementId);

      if (!state.startOutOfBounds) {
        state.startComponent = startComponent;
        state.startElementId = startBinding.elementId;
      } else if (startComponent === state.suggestedComponent) {
        state.startComponent = startComponent;
        state.startElementId = startBinding.elementId;
        state.startOutOfBounds = false;
      }
    }

    if (isDefined(endBinding)) {
      const endComponent = getComponentByElementId(endBinding.elementId);

      if (!state.endOutOfBounds) {
        state.endComponent = endComponent;
        state.endElementId = endBinding.elementId;
      } else if (endComponent === state.suggestedComponent) {
        state.endComponent = endComponent;
        state.endElementId = endBinding.elementId;
        state.endOutOfBounds = false;
      }
    }

    if (
      state.isConnecting &&
      !state.suggestedComponent &&
      state.prevSuggestedComponent &&
      state.prevSuggestedComponent === state.startComponent
    ) {
      state.startComponent = null;
      state.startOutOfBounds = true;
    }

    if (
      state.isConnecting &&
      !state.suggestedComponent &&
      state.prevSuggestedComponent &&
      state.prevSuggestedComponent === state.endComponent
    ) {
      state.endComponent = null;
      state.endOutOfBounds = true;
    }

    nextFn();
  }

  function terminateConnectingState(
    _ctx: ConnectingContext,
    nextFn: NextChainFn,
  ): void {
    if (
      state.isConnecting &&
      !state.startComponent &&
      !state.endComponent &&
      (state.startOutOfBounds || state.endOutOfBounds)
    ) {
      updateState(noConnectionState);
    } else {
      nextFn();
    }
  }

  function connectingNewArrowFromComponent(
    { selectedArrowElement }: ConnectingContext,
    nextFn: NextChainFn,
    stopChain: StopChainFn,
  ): void {
    const startBoundElement = appState.startBoundElement;

    const startConnectingFromNode =
      !state.isConnecting &&
      selectedArrowElement &&
      startBoundElement &&
      isComponentElement(startBoundElement);

    if (startConnectingFromNode) {
      const sourceElementId = startBoundElement.id;
      const sourceComponent = getComponentByElementId(sourceElementId);
      if (sourceComponent) {
        updateConnectingState({
          sourceType: "output",
          sourceElementId,
          sourceComponent,
        });

        stopChain();
      }
    }

    nextFn();
  }

  function connectingArrowWithStartBinding(
    { isDragging }: ConnectingContext,
    nextFn: NextChainFn,
    stopChain: StopChainFn,
  ): void {
    if (
      isDragging &&
      !state.isConnecting &&
      state.startElementId &&
      state.startComponent &&
      !state.endComponent
    ) {
      updateConnectingState({
        sourceType: "output",
        sourceElementId: state.startElementId,
        sourceComponent: state.startComponent,
      });

      stopChain();
    }

    nextFn();
  }

  function connectingArrowWithEndBinding(
    { isDragging }: ConnectingContext,
    nextFn: NextChainFn,
    stopChain: StopChainFn,
  ): void {
    if (
      !state.isConnecting &&
      isDragging &&
      state.endElementId &&
      state.endComponent &&
      !state.startComponent
    ) {
      updateConnectingState({
        sourceType: "input",
        sourceElementId: state.endElementId,
        sourceComponent: state.endComponent,
      });

      stopChain();
    }

    nextFn();
  }

  function connectingArrowWithExistingBinding(
    { selectedArrowElement, isDragging }: ConnectingContext,
    nextFn: NextChainFn,
    stopChain: StopChainFn,
  ): void {
    if (
      isDragging &&
      !state.isConnecting &&
      selectedArrowElement &&
      selectedArrowElement.startBinding &&
      selectedArrowElement.endBinding &&
      state.suggestedComponent
    ) {
      const {
        sourceComponent,
        sourceElementId,
        targetComponent,
        targetElementId,
        sourceSocket,
        targetSocket,
      } = elementWrapper.connection(getRef(selectedArrowElement.id));

      if (
        sourceElementId &&
        targetElementId &&
        sourceComponent &&
        targetComponent &&
        sourceSocket &&
        targetSocket
      ) {
        const suggestedComponent = state.suggestedComponent;
        if (sourceComponent.state.id === suggestedComponent.state.id) {
          updateConnectingState({
            sourceType: "input",
            sourceElementId: targetElementId,
            sourceComponent: targetComponent,
            isBinding: true,
            sourceSocket: targetSocket,
            targetSocket: sourceSocket,
          });
        }
        if (targetComponent.state.id === suggestedComponent.state.id) {
          updateConnectingState({
            sourceType: "output",
            sourceElementId,
            sourceComponent,
            isBinding: true,
            sourceSocket,
            targetSocket,
          });
        }

        stopChain();
      }
    }

    nextFn();
  }

  function suggestConnectingComponents(
    _ctx: ConnectingContext,
    nextFn: NextChainFn,
  ): void {
    if (state.isConnecting) {
      const { suggestedComponent, matchingSockets } = state;
      if (suggestedComponent && matchingSockets) {
        const targetNodeId = suggestedComponent.state.nodeId;
        const bestMatches = matchingSockets.findBestMatchesCached(targetNodeId);

        if (bestMatches.length > 0) {
          const [sourceSocket, targetSocket] = bestMatches[0];
          updateState({
            isBinding: true,
            sourceSocket,
            targetSocket,
          });
        }
      } else {
        updateState(noBindingState);
      }
    }

    nextFn();
  }

  function stoppedConnecting(
    { isDragging, selectedArrowElement }: ConnectingContext,
    nextFn: NextChainFn,
  ): void {
    if (state.isConnecting && !isDragging && selectedArrowElement) {
      const { sourceSocket, targetSocket } =
        state.sourceType === "output"
          ? state
          : {
              sourceSocket: state.targetSocket,
              targetSocket: state.sourceSocket,
            };

      const connection = elementWrapper.connection(
        getRef(selectedArrowElement.id),
      );

      if (connection.hasData) {
        const {
          sourceSocket: existingSourceSocket,
          targetSocket: existingTargetSocket,
        } = connection;

        if (
          sameSocket(sourceSocket, existingSourceSocket) &&
          sameSocket(targetSocket, existingTargetSocket)
        ) {
          updateState(noConnectionState);
          nextFn();
          return;
        }
      }

      if (sourceSocket && targetSocket) {
        attachConnectionDataToArrow({
          arrowElement: selectedArrowElement,
          sourceProperty: sourceSocket.name,
          targetProperty: targetSocket.name,
        });
      } else if (connection.hasData) {
        removeConnectionData(selectedArrowElement);
      }

      _getMatchingSocketsForNode.cache.clear?.();
      updateState(noConnectionState);
    }

    nextFn();
  }

  function updateConnectingState({
    sourceElementId,
    sourceComponent,
    sourceType,

    isBinding = false,
    sourceSocket = null,
    targetSocket = null,
  }: ConnectingStateUpdate): void {
    const nodeId = sourceComponent.state.nodeId;
    const matchingSockets = _getMatchingSocketsForNode(sourceType, nodeId);

    updateState({
      sourceType,
      isConnecting: true,
      sourceElement: getRef(sourceElementId),
      targetElement: null,

      matchingSockets,
      isBinding,
      sourceSocket,
      targetSocket,
    });
  }

  const connectingChain = invocationChain<ConnectingContext>();
  connectingChain.use(
    prepareConnectingContext,
    terminateConnectingState,

    connectingNewArrowFromComponent,
    connectingArrowWithStartBinding,
    connectingArrowWithEndBinding,
    connectingArrowWithExistingBinding,

    stoppedConnecting,
    suggestConnectingComponents,
  );

  subscribeKeys(
    appState,
    [
      "editingElement",
      "startBoundElement",
      "selectedElementIds",
      "draggingElement",
      "suggestedBindings",
    ],
    (_values, _ops) => {
      const initialContext: ConnectingContext = {
        isDragging: false,
        suggestedComponents: [],
      };

      connectingChain.run(initialContext);
    },
  );

  const connectionEffect = elementsUpdater({
    excalidraw,
    elementsFilter: ({ type }) => !(type in ["text", "frame", "selection"]),
  });

  subscribeKeys(
    state,
    ["isConnecting", "isBinding"],
    ([isConnecting, isBinding]) => {
      if (isConnecting) {
        if (isBinding) {
          connectionEffect.update(state.targetElementIds, {
            backgroundColor: "#9be0be",
          });
        } else {
          connectionEffect.update(state.matchingElementIds, {
            backgroundColor: "#a5d8ff",
            fillStyle: "hachure",
          });
        }
      } else {
        connectionEffect.restoreOriginal();
      }
    },
  );

  return { state };
}
