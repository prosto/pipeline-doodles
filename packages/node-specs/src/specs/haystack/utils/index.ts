import { schemaBundle, schemaId } from "@repo/node-specs/schema";

import { schema as ComponentDeviceMultiple } from "./component-device-multiple.schema";
import { schema as ComponentDeviceSingle } from "./component-device-single.schema";
import { schema as ComponentDevice } from "./component-device.schema";
import { schema as EnvVarSecret } from "./env_var_secret.schema";
import { schema as Secret } from "./secret.schema";

export const schemas = [
  Secret,
  EnvVarSecret,
  ComponentDevice,
  ComponentDeviceSingle,
  ComponentDeviceMultiple,
];

export const bundle = schemaBundle({
  $id: schemaId("/haystack/utils"),
  title: "Utils Data Objects",
  schemas,
});
