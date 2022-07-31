import { safeWriteJson } from "../effects/safeWriteJson.ts";

import { fetchIncorrectRawLocalidades } from "./fetchIncorrectRawLocalidades.ts";
import { createParseRawLocalidadesService } from "@/pure/services/parseRawLocalidades/createParseRawLocalidades.ts";

export const parseRawLocalidadesService = createParseRawLocalidadesService({
  safeWriteJson,
  fetchIncorrectRawLocalidades,
});
