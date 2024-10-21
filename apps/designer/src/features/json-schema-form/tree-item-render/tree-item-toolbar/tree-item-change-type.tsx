import { Split } from "lucide-react";
import type { PropsWithChildren } from "react";

import type { SchemaNodeDescriptor } from "@/features/json-schema-reflection";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/components";

import { useSchemaTree, useTreeItem } from "../../hooks";

export function TreeItemChangeType(): JSX.Element {
  const {
    data: { baseSchemaNode },
  } = useTreeItem();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Split className="tw-h-4 tw-w-4 tw-mr-2" />
        <span className="tw-font-semibold">Change Type</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <ChangeTypeVariants node={baseSchemaNode} />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

interface ChangeTypeVariantsProps {
  node: SchemaNodeDescriptor;
}

function ChangeTypeVariants({
  node: { variants },
}: ChangeTypeVariantsProps): JSX.Element {
  const {
    index,
    data: { variantSchemaNode },
  } = useTreeItem();

  const {
    actions: { changeItemType },
  } = useSchemaTree();

  return (
    <DropdownMenuGroup>
      {variants.map((childNode) =>
        childNode.hasVariants ? (
          <ChangeTypeSubMenu key={childNode.variantId} node={childNode}>
            <ChangeTypeVariants node={childNode} />
          </ChangeTypeSubMenu>
        ) : (
          <DropdownMenuCheckboxItem
            checked={variantSchemaNode?.variantId === childNode.variantId}
            key={childNode.variantId}
            onCheckedChange={() => {
              void changeItemType(index, childNode);
            }}
          >
            <span className="tw-font-semibold">
              {childNode.title ?? childNode.schemaType}
            </span>
          </DropdownMenuCheckboxItem>

          // <DropdownMenuItem key={childNode.id}>
          //   <span className="tw-font-semibold">{childNode.title}</span>
          // </DropdownMenuItem>
        ),
      )}
    </DropdownMenuGroup>
  );
}

function ChangeTypeSubMenu({
  node,
  children,
}: PropsWithChildren<ChangeTypeVariantsProps>): JSX.Element {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Split className="tw-h-4 tw-w-4 tw-mr-2" />
        <span>[{node.title || "One Of"}]</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuPortal>
        <DropdownMenuSubContent>{children}</DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
