import { Fragment } from "react";
import { useSnapshot } from "valtio/react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components";

import { EditorView } from "./editor-view";
import { useEditor } from "./hooks";

type EditorViewsProps = React.HTMLAttributes<HTMLDivElement>;

export function EditorViews({ className }: EditorViewsProps): JSX.Element {
  const { state: editor } = useEditor();
  const editorSnap = useSnapshot(editor);
  const editorViews = editorSnap.views;

  const hasMultipleViews = editorViews.size > 1;

  const allViews = Array.from(editorViews.entries());

  return (
    <div className={className}>
      {hasMultipleViews ? (
        <ResizablePanelGroup direction="horizontal" id="editor-views">
          {allViews.map(([viewId, _view], index) => (
            <Fragment key={viewId}>
              <ResizablePanel defaultSize={50} order={index}>
                <EditorView
                  className="tw-h-full"
                  id={`${viewId}-editor-view`}
                  viewId={viewId}
                />
              </ResizablePanel>
              {viewId !== editorSnap.lastView.id && (
                <ResizableHandle
                  className="tw-bg-secondary"
                  style={{ width: "5px" }}
                  withHandle
                />
              )}
            </Fragment>
          ))}
        </ResizablePanelGroup>
      ) : (
        <EditorView
          className="tw-h-full"
          id={`${editorSnap.firstView.id}-editor-view`}
          viewId={editorSnap.firstView.id}
        />
      )}
    </div>
  );
}
