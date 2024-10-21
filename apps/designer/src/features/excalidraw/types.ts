// export * from "node_modules/@excalidraw/excalidraw/types/types";
// export * from "@excalidraw/excalidraw/types/element/types";
// export * from "@excalidraw/excalidraw/types/data/types";
// export * from "@excalidraw/excalidraw/types/data/transform";

export { default as App } from "@excalidraw/excalidraw/types/components/App";
export * from "@excalidraw/excalidraw/types/types";
export * from "@excalidraw/excalidraw/types/element/types";
export * from "@excalidraw/excalidraw/types/actions";
export * from "@excalidraw/excalidraw/types/actions/manager";
export * from "@excalidraw/excalidraw/types/data/types";
export * from "@excalidraw/excalidraw/types/actions/types";
export * from "@excalidraw/excalidraw/types/data/transform";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Excalidraw is dynamically imported (no SSR)
export type ExcalidrawModuleType = typeof import("@excalidraw/excalidraw");
