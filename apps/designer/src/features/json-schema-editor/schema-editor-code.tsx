import { json } from "@codemirror/lang-json";
import { search } from "@codemirror/search";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import type { BasicSetupOptions } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";

import type { SchemaEditorTab } from "@/features/editor/store/types";

import { useHyperlinkExtensions } from "./use-hyperlink-extensions";
import { useSchemaReader } from "./use-shema-reader";

const basicSetup: BasicSetupOptions = {
  crosshairCursor: true,
  lineNumbers: true,
  allowMultipleSelections: true,
  highlightActiveLineGutter: true,
  highlightSpecialChars: true,
  foldGutter: true,
};

interface SchemaEditorCodeProps extends React.HTMLAttributes<HTMLDivElement> {
  editorTab: SchemaEditorTab;
}

export function SchemaEditorCode({
  editorTab,
  className,
}: SchemaEditorCodeProps): JSX.Element {
  const [jsonCode, $refs] = useSchemaReader(editorTab.data.schema);
  const hyperlinkExtensions = useHyperlinkExtensions($refs);

  return (
    <CodeMirror
      basicSetup={basicSetup}
      className={className}
      extensions={[json(), search({ top: true }), ...hyperlinkExtensions]}
      readOnly
      theme={tokyoNight}
      value={jsonCode}
    />
  );
}
