import {
  deleteFirstIncorrectLocalidade,
  queryFirstIncorrectLocalidade,
} from "@/impure/repositories/incorrectLocalidade.repository.ts";
import {
  findOneDistritoByMunicipioId,
  queryAllDistritos,
} from "@/impure/services/distritos.provider.ts";
import { print } from "@/impure/effects/print.ts";
import { ask } from "@/impure/effects/ask.ts";
import { UpdateLocalidadesController } from "@/pure/controllers/updateLocalidade/createUpdateLocalidades.controller.ts";
import { insertCorrectLocalidade } from "@/impure/repositories/correctLocalidade.repository.ts";
import { insertIgnoredLocalidade } from "@/impure/repositories/ignoredLocalidade.repository.ts";

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

const result = await updateLocalidadesController();
if (result.isFail()) {
  throw result.value;
}
