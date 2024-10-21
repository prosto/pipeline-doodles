import { isDefined } from "@repo/shared/utils";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { useSnapshot } from "valtio";

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components";
import type { ClassValue } from "@repo/ui/utils";
import { cn } from "@repo/ui/utils";

import { useArrayControlsStore, useTreeItemOffset } from "../../hooks";
import type { ArrayItemEntry } from "../../store/tree-item-controls";

interface TreeItemArrayControlsProps {
  className?: ClassValue;
}

export function TreeItemArrayControls({
  className,
}: TreeItemArrayControlsProps): JSX.Element {
  const offsetPx = useTreeItemOffset(1);

  const controlsStore = useArrayControlsStore();

  const {
    actions: { addSelected, setSelected },
  } = controlsStore;

  const { selectedTitle, selectedId, items, dynamicItems } = useSnapshot(
    controlsStore.state,
  );

  return (
    <div
      className={cn(
        "tw-bg-secondary/60 tw-opacity-40 hover:tw-opacity-80 tw-mb-2",
        className,
      )}
      style={{
        marginLeft: offsetPx,
      }}
    >
      <div className={cn("tw-flex tw-items-center")}>
        <Button
          className="tw-mr-1"
          disabled={!isDefined(selectedId)}
          onClick={(evt) => {
            evt.stopPropagation();
            evt.preventDefault();

            addSelected();
          }}
          size="sm"
          variant="ghost"
        >
          <PlusCircle className="tw-mr-2 tw-h-4 tw-w-4" />
          add item
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="tw-justify-between" size="sm" variant="ghost">
              <span className="tw-font-semibold tw-mr-2">{selectedTitle}</span>
              <ChevronsUpDown className="tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="tw-w-56 tw-max-h-36">
            <SchemaItemsGroup
              items={items as ArrayItemEntry[]}
              selectedId={selectedId}
              setSelectedItem={setSelected}
              title="Item Value"
            />

            <SchemaItemsGroup
              items={dynamicItems as ArrayItemEntry[]}
              selectedId={selectedId}
              setSelectedItem={setSelected}
              title="Additional Item Value"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface SchemaItemsGroupProps {
  items: ArrayItemEntry[];
  title: string;
  selectedId?: string;
  setSelectedItem: (id: string) => void;
}

function SchemaItemsGroup({
  items,
  title,
  selectedId,
  setSelectedItem,
}: SchemaItemsGroupProps): JSX.Element | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {items.map(({ entryId, title: itemTitle }) => (
        <DropdownMenuCheckboxItem
          checked={selectedId === entryId}
          key={entryId}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedItem(entryId);
            }
          }}
        >
          {itemTitle}
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );
}
