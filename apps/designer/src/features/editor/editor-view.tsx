import { useRef } from "react";
import { useSnapshot } from "valtio";

import { Separator } from "@repo/ui/components";
import { useEventListener } from "@repo/ui/hooks";
import { cn } from "@repo/ui/utils";

import { EditorTabs } from "./editor-tabs";
import { useEditorActions, useEditorView } from "./hooks";

interface EditorViewProps extends React.HTMLAttributes<HTMLDivElement> {
  viewId: string;
}

export function EditorView({
  className,
  viewId,
  id,
}: EditorViewProps): JSX.Element {
  const editorView = useEditorView(viewId);
  const { isActive } = useSnapshot(editorView);

  const { setActiveView } = useEditorActions();

  const tabsRef = useRef<HTMLDivElement>(null);
  useEventListener(
    "click",
    () => {
      setActiveView(editorView.id);
    },
    tabsRef,
  );

  return (
    <div className={className} id={id} ref={tabsRef}>
      <Separator
        className={cn(
          "tw-h-2 tw-bg-transparent",
          isActive && "tw-bg-gradient-to-r tw-from-ring/20 tw-bg-muted/30",
        )}
      />
      <EditorTabs
        className="tw-h-full"
        id={`${viewId}-editor-tabs`}
        viewId={viewId}
      />
    </div>
  );
}
