import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import {
  createQueryFirstLocalidade,
} from "@/repositories/LocalidadesRepository/createLocalidadeRepository.ts";

const INCORRECT_LOCALIDADE_FILE_PATH = "./private/incorretos.json";

export const queryFirstIncorrectLocalidade = createQueryFirstLocalidade({
  path: INCORRECT_LOCALIDADE_FILE_PATH,
  safeReadJson,
});
