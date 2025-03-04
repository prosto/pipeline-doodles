import type {
  ExcalidrawElementSkeleton,
  ExcalidrawTextElement,
} from "@/features/excalidraw/types";

export const skeletonElements: ExcalidrawElementSkeleton[] = [
  {
    type: "rectangle",
    id: "ApZnvA1rZZXOLh7GqHVfi",
    fillStyle: "hachure",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    angle: 0,
    x: 376.1454925149119,
    y: -48.22395170907345,
    strokeColor: "#15aabf",
    backgroundColor: "#ffec99",
    width: 330,
    height: 100,
    seed: 1136671343,
    groupIds: ["PeH6rX-22cszke4txNsNs"],
    frameId: null,
    roundness: { type: 3 },
    boundElements: [{ type: "text", id: "caIaJYgZ6sCpRG1KVpWzf" }],
    link: null,
    locked: false,
    customData: {
      type: "document-store",
      schemaId: "<required>",
    },
  },
  {
    type: "text",
    id: "caIaJYgZ6sCpRG1KVpWzf",
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    angle: 0,
    x: 384.1412856826996,
    y: -43.22395170907345,
    strokeColor: "#343a40",
    backgroundColor: "transparent",
    width: 314.9296875,
    height: 143.37070250594263,
    seed: 122709967,
    groupIds: ["PeH6rX-22cszke4txNsNs"],
    frameId: null,
    roundness: null,
    boundElements: [],
    link: null,
    locked: false,
    fontSize: 15.5,
    fontFamily: 3,
    text: "<binding>",
    textAlign: "center",
    verticalAlign: "top",
    containerId: "ApZnvA1rZZXOLh7GqHVfi",
    originalText: "<binding>",
    lineHeight: 1.25 as ExcalidrawTextElement["lineHeight"],
    customData: {
      type: "document-store",
      schemaId: "<required>",
      binding: {
        text: "\n\n\n{{=state.schema.__pyType}}",
        originalText: "\n\n\n{{=state.schema.__pyType}}",
      },
    },
  },
  {
    id: "9YLgZwCPofCrKrXq8FA8N",
    type: "rectangle",
    x: 376.36614839926295,
    y: -48.14126586914065,
    width: 330.71340151002096,
    height: 48.42108508242018,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 0,
    groupIds: ["PeH6rX-22cszke4txNsNs"],
    frameId: null,
    roundness: null,
    seed: 1801590337,
    boundElements: [{ type: "text", id: "QUdgW5zHPtmoQvOg5iT3N" }],
    link: null,
    locked: false,
    customData: {
      type: "document-store",
      schemaId: "<required>",
    },
  },
  {
    id: "QUdgW5zHPtmoQvOg5iT3N",
    type: "text",
    x: 492.5216772792735,
    y: -35.13155946120733,
    width: 98.40234375,
    height: 22.401672266553533,
    angle: 0,
    strokeColor: "#08835D",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: ["PeH6rX-22cszke4txNsNs"],
    frameId: null,
    roundness: null,
    seed: 1220883919,
    boundElements: null,
    link: null,
    locked: false,
    text: "<binding>",
    fontSize: 24,
    fontFamily: 3,
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: 1.25 as ExcalidrawTextElement["lineHeight"],
    containerId: "9YLgZwCPofCrKrXq8FA8N",
    originalText: "<binding>",
    customData: {
      type: "document-store",
      schemaId: "<required>",
      binding: {
        text: "{{=state.name}}",
        originalText: "{{=state.name}}",
      },
    },
  },
];
