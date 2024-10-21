import { SchemaEditor } from "@/features/json-schema-editor";
import { PipelineEditor } from "@/features/pipeline";
import { PipelineDefinitionEditor } from "@/features/pipeline-definition-editor";

import { EditorViews } from "./editor-views";
import { registerEditor } from "./store/editor-registry";

// TODO Find way to "plugin" editors more properly
registerEditor("pipeline", PipelineEditor);
registerEditor("schema-editor", SchemaEditor);
registerEditor("pipeline-json-editor", PipelineDefinitionEditor);

type EditorProps = React.HTMLAttributes<HTMLDivElement>;

export function Editor({ className }: EditorProps): JSX.Element {
  return <EditorViews className={className} />;
}
