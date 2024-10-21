import { additionalDescriptors } from "../extra-descriptors";

import type { SchemaNodeDescriptor, SchemaNodeFactory } from "./types";

export const extraProperties: SchemaNodeDescriptor[] = [];

export async function loadExtraProperties(
  nodeFactory: SchemaNodeFactory,
): Promise<void> {
  if (extraProperties.length === 0) {
    const nodes = await Promise.all(
      Object.entries(additionalDescriptors)
        .map(
          ([_name, descriptor]) =>
            nodeFactory({
              descriptor,
              type: "descriptor",
            }) as SchemaNodeDescriptor,
        )
        .map((node) => node.buildNode()),
    );

    extraProperties.push(...nodes);
  }
}
