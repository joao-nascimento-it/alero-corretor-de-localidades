import {
  deleteFirstIncorrectLocalidade,
  queryFirstIncorrectLocalidade,
} from "@/repositories/IncorrectLocalidadesRepository/index.ts";
import {
  findOneDistritoByMunicipioId,
  queryAllDistritos,
} from "@/providers/DistritosProvider/index.ts";
import { print } from "@/shared/print/index.ts";
import { ask } from "@/shared/ask/index.ts";
import { UpdateLocalidadesController } from "./createUpdateLocalidades.controller.ts";
import { insertCorrectLocalidade } from "@/repositories/CorrectLocalidadesRepository/index.ts";
import { insertIgnoredLocalidade } from "../../repositories/IgnoredLocalidadesRepository/index.ts";

export function updateLocalidadesController() {
  return UpdateLocalidadesController({
    queryFirstIncorrectLocalidade,
    queryAllDistritos,
    insertCorrectLocalidade,
    deleteFirstIncorrectLocalidade,
    print,
    ask,
    findOneDistritoByMunicipioId,
    insertIgnoredLocalidade,
  });
}

await updateLocalidadesController();
