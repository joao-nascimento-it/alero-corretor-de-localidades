import { safeWriteJson } from "../../shared/safeWriteJson/index.ts";
import { createParseRawLocalidadesService } from "./createParseRawLocalidades.ts";
import { fetchIncorrectRawLocalidades } from "./fetchIncorrectRawLocalidades.ts/index.ts";

export const parseRawLocalidadesService = createParseRawLocalidadesService({
  safeWriteJson,
  fetchIncorrectRawLocalidades,
});
