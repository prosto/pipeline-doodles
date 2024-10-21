import { presetStore } from "../store";

type Presets = typeof presetStore;

export function usePresets(): Presets {
  return presetStore;
}
