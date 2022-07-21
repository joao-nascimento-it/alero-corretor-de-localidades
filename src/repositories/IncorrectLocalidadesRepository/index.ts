import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import {
  createDeleteFirstLocalidade,
  createQueryFirstLocalidade,
} from "@/repositories/LocalidadesRepository/createLocalidadeRepository.ts";
import { safeWriteJson } from "@/shared/safeWriteJson/index.ts";

const INCORRECT_LOCALIDADE_FILE_PATH = "./private/incorretos.json";

export const queryFirstIncorrectLocalidade = createQueryFirstLocalidade({
  path: INCORRECT_LOCALIDADE_FILE_PATH,
  safeReadJson,
});

export const deleteFirstIncorrectLocalidade = createDeleteFirstLocalidade({
  path: INCORRECT_LOCALIDADE_FILE_PATH,
  safeReadJson,
  safeWriteJson,
});
