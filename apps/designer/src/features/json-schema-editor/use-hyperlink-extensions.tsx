import type { $Refs } from "@repo/json-schema";
import { schemaId } from "@repo/node-specs/schema";
import type { NodeJsonSchema, SchemaId } from "@repo/node-specs/types";
import * as events from "@uiw/codemirror-extensions-events";
import {
  hyperLinkExtension,
  hyperLinkStyle,
} from "@uiw/codemirror-extensions-hyper-link";
import type { Extension } from "@uiw/react-codemirror";

import { useEditorActions } from "@/features/editor/hooks";
import { schemaEditorTab } from "@/features/editor/store/editor-tab";

const schemaLinkRegex = /"\$ref":\s?"(?<link>[^"]+)"/gi;

export const hyperLink: Extension = [
  hyperLinkExtension({
    regexp: schemaLinkRegex,
    handle: (value) => {
      schemaLinkRegex.lastIndex = 0;
      const groups = schemaLinkRegex.exec(value)?.groups;
      return groups?.link ? groups.link : value;
    },
    anchor: (dom: HTMLAnchorElement) => {
      dom.dataset.schemaLink = "yes";
      dom.title = "Open Schema";
      return dom;
    },
  }),
  hyperLinkStyle,
];

export function useHyperlinkExtensions($refs?: $Refs): Extension[] {
  const { addEditorTab } = useEditorActions();

  const eventExt = events.dom({
    click: (evn) => {
      const schema = getSchemaFromLink(evn, $refs);
      if (schema) {
        evn.preventDefault();

        addEditorTab(
          schemaEditorTab(schema, {
            title: schema.title,
            id: schema.$id,
          }),
        );
      }
    },
  });

  return [hyperLink, eventExt];
}

function getSchemaFromLink(
  event: MouseEvent,
  $refs?: $Refs,
): NodeJsonSchema | undefined {
  if (event.target && event.target instanceof Element && $refs) {
    const closestHref = event.target.closest("a");

    if (closestHref?.dataset.schemaLink) {
      const schemaUri = closestHref.getAttribute("href");
      const refSchema = $refs.get(schemaId(schemaUri as SchemaId));

      return refSchema as NodeJsonSchema;
    }
  }

  return undefined;
}
