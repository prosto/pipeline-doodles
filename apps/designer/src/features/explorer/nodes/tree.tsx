import { ControlledTreeEnvironment, Tree } from "react-complex-tree";
import { useSnapshot } from "valtio";

import { cn } from "@repo/ui/utils";

import { usePresets } from "../hooks/use-presets";
import type { PresetItems } from "../store/types";

import { NodeTreeItem } from "./tree-item";
import { NodeTreeItemArrow } from "./tree-item-arrow";

interface NodesTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

export function NodesTree({ className }: NodesTreeProps): JSX.Element {
  const presetsStore = usePresets();
  const { viewState } = presetsStore;

  const {
    selected: {
      state: selectedPresetSnap,
      actions: {
        collapseItem,
        expandItem,
        focusItem,
        loadMissingItems,
        selectItems,
      },
    },
  } = useSnapshot(presetsStore);

  return (
    <div className={cn("tw-w-full", className)}>
      <ControlledTreeEnvironment
        data-selected-viewState={selectedPresetSnap.viewState}
        getItemTitle={(item) => item.data.title}
        items={selectedPresetSnap.items as PresetItems}
        onCollapseItem={collapseItem}
        onExpandItem={expandItem}
        onFocusItem={focusItem}
        onMissingItems={loadMissingItems}
        onSelectItems={selectItems}
        renderItem={(props) => NodeTreeItem(props)}
        renderItemArrow={({ item, context }) =>
          NodeTreeItemArrow({
            isFolder: item.isFolder,
            isExpanded: context.isExpanded,
          })
        }
        renderItemsContainer={({ children, containerProps, depth }) => (
          <ul
            {...containerProps}
            style={{
              paddingLeft: `${depth > 0 ? depth + 10 : 0}px`,
            }}
          >
            {children}
          </ul>
        )}
        viewState={viewState}
      >
        <Tree
          rootItem={selectedPresetSnap.rootItem}
          treeId={selectedPresetSnap.id}
          treeLabel={selectedPresetSnap.title}
        />
      </ControlledTreeEnvironment>
    </div>
  );
}
