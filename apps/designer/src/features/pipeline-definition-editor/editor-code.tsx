import { json as jsonExt } from "@codemirror/lang-json";
import { yaml as yamlExt } from "@codemirror/lang-yaml";
import { search } from "@codemirror/search";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import type {
  BasicSetupOptions,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import CodeMirror, { Compartment } from "@uiw/react-codemirror";
import { useRef } from "react";
import { useSnapshot } from "valtio";

import { useSingleton } from "@repo/ui/hooks";

import { useEditorStoreContext } from "./editor-store-provider";

const customTheme = tokyoNightInit({
  settings: {
    fontSize: "11pt",
  },
});

const basicSetup: BasicSetupOptions = {
  crosshairCursor: true,
  lineNumbers: true,
  allowMultipleSelections: true,
  highlightActiveLineGutter: true,
  highlightSpecialChars: true,
  foldGutter: true,
};

type EditorCodeProps = React.HTMLAttributes<HTMLDivElement>;

export function PipelineDefEditorCode({
  className,
}: EditorCodeProps): JSX.Element {
  const editorStore = useEditorStoreContext();
  const { mode, formattedEditorValue } = useSnapshot(editorStore.state);

  const languageConf = useSingleton(() => new Compartment());
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  return (
    <CodeMirror
      basicSetup={basicSetup}
      className={className}
      extensions={[
        languageConf.of(mode === "yaml" ? yamlExt() : jsonExt()),
        search({ top: true }),
      ]}
      readOnly
      ref={editorRef}
      theme={customTheme}
      value={formattedEditorValue}
    />
  );
}
