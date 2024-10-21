import { Blocks, Component } from "lucide-react";
import { match } from "ts-pattern";

import { customComponentsPreset, haystackCorePreset } from "../store";
import type { Preset } from "../store/types";

type PresetIconProps = {
  preset: Preset;
} & React.HTMLAttributes<HTMLDivElement>;

export function PresetIcon({ preset }: PresetIconProps): JSX.Element {
  return match(preset)
    .with({ state: { id: haystackCorePreset.state.id } }, () => <Blocks />)
    .with({ state: { id: customComponentsPreset.state.id } }, () => (
      <Component />
    ))
    .otherwise(() => <Blocks />);
}
