import type { JSONSchema } from "@repo/json-schema";
import { merge } from "lodash-es";
import cloneDeepWith from "lodash-es/cloneDeepWith";
import { nanoid } from "nanoid";
import { match } from "ts-pattern";

import type { ExcalidrawElementSkeleton } from "@/features/excalidraw/types";

import type { CustomExcalidrawElement } from "../types";

import { skeletonElements as componentSkeleton } from "./component-skeleton";
import { skeletonElements as documentStoreSkeleton } from "./document-store-skeleton";

interface FactoryProps {
  schema: JSONSchema;
  assignIds?: boolean;
}

export function skeletonFactory<T extends CustomExcalidrawElement>({
  schema,
  assignIds,
}: FactoryProps): T[] {
  const nodeType = schema.__nodeType;

  const skeletonsToCreate = match(nodeType)
    .with("component", () => componentSkeleton)
    .with("document-store", () => documentStoreSkeleton)
    .otherwise(() => {
      throw new Error(`Skeleton type: "${String(nodeType)}" is not supported`);
    });

  const skeletonsWithNewIds = assignIds
    ? assignNewIds(skeletonsToCreate)
    : skeletonsToCreate;

  return skeletonsWithNewIds.map((skeleton) => {
    merge(skeleton.customData, {
      schemaId: schema.$id,
      type: nodeType,
    });
    return skeleton as T;
  });
}

/*eslint @typescript-eslint/no-unsafe-argument: "off" -- TODO*/
/*eslint @typescript-eslint/no-unsafe-assignment: "off" -- TODO*/
export function assignNewIds(
  elements: ExcalidrawElementSkeleton[],
): ExcalidrawElementSkeleton[] {
  const clonedElements: ExcalidrawElementSkeleton[] = [];

  const idMapping = new Map<string, string>();
  const groupIdMapping = new Map<string, string>();

  for (const element of elements) {
    const newElement = cloneDeepWith(element, (value, key) => {
      if (idMapping.has(value)) {
        return idMapping.get(value);
      }

      if (key === "id") {
        const newId = nanoid();
        idMapping.set(value, newId);
        return newId;
      }

      if (key === "groupIds") {
        const groupIds = value as string[];

        return groupIds.map((groupId) => {
          if (groupIdMapping.has(groupId)) {
            return groupIdMapping.get(groupId);
          }
          const newGroupId = nanoid();
          groupIdMapping.set(groupId, newGroupId);
          return newGroupId;
        });
      }
    });

    clonedElements.push(newElement);
  }

  return clonedElements;
}
