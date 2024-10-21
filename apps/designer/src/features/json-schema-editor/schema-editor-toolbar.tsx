import { nodeJsonSchemaReader } from "@repo/node-specs/registry";
import { Copy, FileSearch } from "lucide-react";

import { useEditorTabContext } from "@/features/editor/hooks";
import type { SchemaEditorTab } from "@/features/editor/store";
import { ToolbarButton } from "@/features/ui";
import { useToast } from "@repo/ui/components";
import { useCopyToClipboard } from "@repo/ui/hooks";
import { cn } from "@repo/ui/utils";

type SchemaEditorToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export function SchemaEditorToolbar({
  className,
}: SchemaEditorToolbarProps): JSX.Element {
  const [_text, copy] = useCopyToClipboard();
  const { toast } = useToast();
  const editorTab = useEditorTabContext<SchemaEditorTab>();
  const {
    data: { schema },
  } = editorTab;

  async function copyCodeToClipboard(): Promise<void> {
    const jsonCode = await nodeJsonSchemaReader({ schema }).jsonString();

    const result = await copy(jsonCode);

    if (result) {
      toast({
        title: "Heads Up!",
        description: "Copied code to clipboard.",
      });
    }
  }

  return (
    <div className={cn("tw-flex tw-items-center", className)}>
      <div className="tw-flex tw-items-center tw-gap-2">
        <ToolbarButton
          Icon={Copy}
          onClick={() => {
            void copyCodeToClipboard();
          }}
          text="Copy"
        />
        <ToolbarButton Icon={FileSearch} text="Reveal In Explorer" />
      </div>
    </div>
  );
}
