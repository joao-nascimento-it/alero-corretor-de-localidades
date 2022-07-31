import { createParseRawLocalidadesController } from "@/pure/controllers/parseRawLocalidades/parseRawLocalidades.controller.ts";
import { print } from "@/impure/effects/print.ts";
import { ask } from "@/impure/effects/ask.ts";
import { parseRawLocalidadesService } from "@/impure/services/parseRawLocalidades.service.ts";

const parseRawLocalidadesController = createParseRawLocalidadesController(
  parseRawLocalidadesService,
  print,
  ask,
);
await parseRawLocalidadesController();
