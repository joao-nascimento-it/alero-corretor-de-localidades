import { queryFirstIncorrectLocalidade } from "@/repositories/IncorrectLocalidadesRepository/index.ts";
import { queryAllDistritos } from "@/providers/DistritosProvider/index.ts";
import { print } from "@/shared/print/index.ts";
import { ask } from "@/shared/ask/index.ts";
import { createUpdateLocalidadesController } from "./createUpdateLocalidades.controller.ts";

export function updateLocalidadesController() {
  return createUpdateLocalidadesController({
    queryFirstIncorrectLocalidade,
    queryAllDistritos,
    print,
    ask,
  });
}

await updateLocalidadesController();
