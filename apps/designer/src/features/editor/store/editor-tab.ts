import type { JSONSchema } from "@repo/json-schema";
import { nanoid } from "nanoid";
import { ref } from "valtio";

import { pipelineFactory } from "../../pipeline/store";

import type { EditorTab } from "./types";

const defaultTabProps = {
  title: "Untitled 1",
  type: "default",
  saved: false,
  hasChanges: false,
};

export function editorTabFactory(
  editorTabProps: Partial<EditorTab>,
): EditorTab {
  const id = nanoid();

  const editorTab: EditorTab = {
    id,
    ...defaultTabProps,
    ...editorTabProps,
  };

  return editorTab;
}

export const defaultTabFactory = {
  create: () => pipelineEditorTab(),
};

export function registerDefaultTabFactory(
  factory: typeof defaultTabFactory.create,
): void {
  defaultTabFactory.create = factory;
}

export function pipelineEditorTab({
  title = "Untitled 1",
}: Partial<EditorTab> = {}): EditorTab {
  const pipeline = pipelineFactory({ name: title });
  const editorTab = editorTabFactory({
    title,
    type: "pipeline",
    data: ref(pipeline),
  });

  // watch((get) => {
  //   editorTab.title = get(pipeline.state).name;
  //   editorTab.hasChanges = get(pipeline.state).hasChanges;
  // });

  return editorTab;
}

export function schemaEditorTab(
  schema: JSONSchema | string,
  tabProps: Partial<EditorTab> = {},
): EditorTab {
  return editorTabFactory({
    type: "schema-editor",
    saved: true,
    hasChanges: false,
    data: {
      schema,
    },
    ...tabProps,
  });
}

export function pipelineJsonEditorTab(
  json: object,
  mode = "yaml",
  tabProps: Partial<EditorTab> = {},
): EditorTab {
  return editorTabFactory({
    type: "pipeline-json-editor",
    title: "Pipeline Definition",
    saved: true,
    hasChanges: false,
    data: {
      json,
      mode,
    },
    ...tabProps,
  });
}
