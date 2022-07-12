import { print } from "@/shared/print/index.ts";
import { parseRawLocalidadesService } from "../../services/parseRawLocalidades/index.ts";
import { ask } from "@/shared/ask/index.ts";
import { createParseRawLocalidadesController } from "./parseRawLocalidades.controller.ts";

const parseRawLocalidadesController = createParseRawLocalidadesController(
  parseRawLocalidadesService,
);
await parseRawLocalidadesController(print, ask);
