import { schemaId } from "@repo/node-specs/schema";
import { ensureIsDefined } from "@repo/shared/utils";
import type { TreeViewState } from "react-complex-tree";
import { proxy, ref } from "valtio";

import { schemaBundlePresetFactory } from "./preset";
import type { Preset } from "./types";

export const haystackCorePreset = schemaBundlePresetFactory({
  id: "haystack-core",
  title: "Haystack Core",
  bundleIds: [
    schemaId("/haystack/components"),
    schemaId("/haystack/document-stores"),
    schemaId("/haystack/dataclasses"),
    schemaId("/haystack/utils"),
  ],
  viewState: {
    expandedItems: [schemaId("/haystack/components")],
  },
});

export const customComponentsPreset = schemaBundlePresetFactory({
  id: "haystack-custom",
  title: "Custom Components",
  bundleIds: [schemaId("/custom")],
});

const presets: Preset[] = [haystackCorePreset, customComponentsPreset];

export interface ExplorerStore {
  selectedId: string;
  presets: Preset[];
  selected: Preset;
  viewState: TreeViewState;
}

export const presetStore = proxy<ExplorerStore>({
  selectedId: haystackCorePreset.state.id,
  presets,
  get selected(): Preset {
    return ensureIsDefined(
      presetStore.presets.find(
        (preset) => preset.state.id === presetStore.selectedId,
      ),
    );
  },
  viewState: ref({
    [haystackCorePreset.state.id]: haystackCorePreset.state.viewState,
    [customComponentsPreset.state.id]: customComponentsPreset.state.viewState,
  }),
});
