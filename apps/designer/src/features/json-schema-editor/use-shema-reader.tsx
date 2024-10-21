import type { $Refs, JSONSchema } from "@repo/json-schema";
import { nodeJsonSchemaReader } from "@repo/node-specs/registry";
import { useEffect, useMemo, useState } from "react";

export function useSchemaReader(
  schema: JSONSchema | string,
): [string, $Refs | undefined] {
  const reader = useMemo(() => nodeJsonSchemaReader({ schema }), [schema]);
  const [jsonCode, setJsonCode] = useState("");
  const [refs, setRefs] = useState<$Refs>();

  useEffect(() => {
    async function resolveSchema(): Promise<void> {
      setJsonCode(await reader.jsonString());
      setRefs(await reader.resolve());
    }
    void resolveSchema();
  }, [reader]);

  return [jsonCode, refs];
}
