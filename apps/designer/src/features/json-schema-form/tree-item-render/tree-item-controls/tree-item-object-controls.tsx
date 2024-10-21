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

import { useTreeItemOffset, useObjectControlsStore } from "../../hooks";
import type { PropertyEntry } from "../../store/tree-item-controls";

interface TreeItemSchemaObjectControlsProps {
  className?: ClassValue;
}

export function TreeItemSchemaObjectControls({
  className,
}: TreeItemSchemaObjectControlsProps): JSX.Element {
  const offsetPx = useTreeItemOffset(1);

  const objectControlStore = useObjectControlsStore();

  const {
    actions: { addSelected, setSelected: setSelectedProperty },
  } = objectControlStore;

  const controlsStateSnap = useSnapshot(objectControlStore.state);

  const {
    selectedTitle,
    selectedId,
    optionalProperties,
    additionalProperties,
    dynamicProperties,
    isVisible: hasProperties,
  } = controlsStateSnap;

  const hasNoProperties = !hasProperties;

  return (
    <div
      className={cn(
        "tw-bg-secondary/60 tw-opacity-50 tw-mb-2",
        hasProperties && "hover:tw-opacity-90",
        hasNoProperties && "tw-hidden",
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

            void addSelected();
          }}
          size="sm"
          variant="ghost"
        >
          <PlusCircle className="tw-mr-2 tw-h-4 tw-w-4" />
          add property
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="tw-justify-between"
              disabled={hasNoProperties}
              size="sm"
              variant="ghost"
            >
              <span className="tw-font-semibold tw-mr-2">{selectedTitle}</span>
              <ChevronsUpDown className="tw-h-4 tw-w-4 tw-shrink-0 tw-opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="tw-w-56">
            <SchemaPropertyGroup
              properties={optionalProperties as PropertyEntry[]}
              selectedId={selectedId}
              setSelectedProperty={setSelectedProperty}
              title="Optional Properties"
            />

            <SchemaPropertyGroup
              properties={additionalProperties as PropertyEntry[]}
              selectedId={selectedId}
              setSelectedProperty={setSelectedProperty}
              title="Additional Properties"
            />

            <SchemaPropertyGroup
              properties={dynamicProperties as PropertyEntry[]}
              selectedId={selectedId}
              setSelectedProperty={setSelectedProperty}
              title="Additional Properties"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface SchemaPropertiesGroupProps {
  properties: PropertyEntry[];
  title: string;
  selectedId?: string;
  setSelectedProperty: (id: string) => void;
}

function SchemaPropertyGroup({
  properties,
  title,
  selectedId,
  setSelectedProperty,
}: SchemaPropertiesGroupProps): JSX.Element | null {
  if (properties.length === 0) {
    return null;
  }

  return (
    <>
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {properties.map(({ propertyId, title: propertyTitle }) => (
        <DropdownMenuCheckboxItem
          checked={selectedId === propertyId}
          key={propertyId}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedProperty(propertyId);
            }
          }}
        >
          {propertyTitle}
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );
}
