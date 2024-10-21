import type { ComponentType } from "react";

import type { EditorTab, EditorType } from "./types";

export interface EditorComponentProps {
  editorTab: EditorTab;
}

export type EditorComponent<
  T extends EditorComponentProps = EditorComponentProps,
> = ComponentType<T>;

export const editorTypes = new Map<EditorType, EditorComponent>();

// TODO Move registry to a separate feature?
export function registerEditor<
  T extends EditorComponentProps = EditorComponentProps,
>(type: EditorType, component: EditorComponent<T>): void {
  editorTypes.set(type, component as EditorComponent);
}

export function getEditorComponent(
  type: EditorType,
): EditorComponent | undefined {
  return editorTypes.get(type);
}
