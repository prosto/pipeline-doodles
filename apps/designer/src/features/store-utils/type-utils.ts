import { getVersion } from "valtio";

export const isValtioProxy = (obj: unknown): boolean =>
  typeof getVersion(obj) === "number";
