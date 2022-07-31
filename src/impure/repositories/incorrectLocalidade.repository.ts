import { config } from "@/config.ts";
import { safeReadJson } from "../effects/safeReadJson.ts";
import { safeWriteJson } from "../effects/safeWriteJson.ts";
import {
  createDeleteFirstLocalidade,
  createQueryFirstLocalidade,
} from "@/pure/repositories/LocalidadesRepository/createLocalidadeRepository.ts";

export const queryFirstIncorrectLocalidade = createQueryFirstLocalidade({
  path: config.INCORRECT_LOCALIDADE_FILE_PATH,
  safeReadJson,
});

export const deleteFirstIncorrectLocalidade = createDeleteFirstLocalidade({
  path: config.INCORRECT_LOCALIDADE_FILE_PATH,
  safeReadJson,
  safeWriteJson,
});
