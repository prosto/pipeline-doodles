import { Copy } from "lucide-react";
import { useSnapshot } from "valtio";

import { ToolbarButton } from "@/features/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@repo/ui/components";
import { useCopyToClipboard } from "@repo/ui/hooks";
import { cn } from "@repo/ui/utils";

import { useEditorStoreContext } from "./editor-store-provider";
import type { EditorMode } from "./types";

type ToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export function PipelineDefEditorToolbar({
  className,
}: ToolbarProps): JSX.Element {
  const [_text, copy] = useCopyToClipboard();
  const { toast } = useToast();

  const editorStore = useEditorStoreContext();
  const { mode, formattedEditorValue } = useSnapshot(editorStore.state);

  async function copyCodeToClipboard(): Promise<void> {
    const result = await copy(formattedEditorValue);

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

        <Select
          onValueChange={(value) => {
            editorStore.actions.changeMode(value as EditorMode);
          }}
          value={mode}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="yaml">Yaml</SelectItem>
              <SelectItem value="json">Json</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
