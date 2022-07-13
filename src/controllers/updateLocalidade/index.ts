import { queryFirstIncorrectLocalidade } from "@/repositories/IncorrectLocalidadesRepository/index.ts";
import { querySimilarDistritosByName } from "@/providers/DistritosProvider/index.ts";
import { print } from "@/shared/print/index.ts";
import { ask } from "@/shared/ask/index.ts";
import { createUpdateLocalidadesController } from "./createUpdateLocalidades.controller.ts";

export const updateLocalidadesController = createUpdateLocalidadesController(
  queryFirstIncorrectLocalidade,
  querySimilarDistritosByName,
);

await updateLocalidadesController(print, ask);
