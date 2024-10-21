import * as React from "react";
import { useSnapshot } from "valtio";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components";
import { cn } from "@repo/ui/utils";

import { usePresets } from "../hooks/use-presets";
import type { Preset } from "../store/types";

import { PresetIcon } from "./preset-icons";

type PresetSelectorProps = React.HTMLAttributes<HTMLDivElement>;

export function PresetSelector({
  className,
}: PresetSelectorProps): JSX.Element {
  const presetsStore = usePresets();
  const { selected: selectedPreset } = presetsStore;

  const { selectedId, presets: presetsSnap } = useSnapshot(presetsStore);
  const selectedPresetSnap = useSnapshot(selectedPreset.state);

  const onSelectPreset = (presetId: string): void => {
    presetsStore.selectedId = presetId;
  };

  return (
    <div className={className}>
      <Select defaultValue={selectedId} onValueChange={onSelectPreset}>
        <SelectTrigger
          aria-label="Select Preset"
          className={cn(
            "tw-flex tw-items-center tw-gap-2",
            "[&>span]:tw-flex [&>span]:tw-font-semibold [&>span]:tw-justify-start [&>span]:tw-items-center",
            "[&_svg]:tw-h-5 [&_svg]:tw-w-5 [&_svg]:tw-ml-2 [&_svg]:tw-inline-block",
          )}
        >
          <SelectValue placeholder="Select Preset">
            <PresetIcon preset={selectedPreset} />
            <span className="tw-ml-2">{selectedPresetSnap.title}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {presetsSnap.map((preset) => (
            <SelectItem key={preset.state.id} value={preset.state.id}>
              <div
                className={cn(
                  "tw-flex tw-items-center tw-gap-3",
                  "[&_svg]:tw-h-5 [&_svg]:tw-w-5 [&_svg]:tw-shrink-0 [&_svg]:tw-text-foreground",
                )}
              >
                <PresetIcon preset={preset as Preset} />
                {preset.state.title}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
