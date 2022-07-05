import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { safeWriteJson } from "@/shared/safeWriteJson/index.ts";
import {
  createInsertLocalidade,
} from "@/repositories/LocalidadesRepository/createLocalidadeRepository.ts";

const CORRECT_LOCALIDADES_FILE_PATH = "./private/incorretos.json";

export const insertCorrectLocalidade = createInsertLocalidade({
  path: CORRECT_LOCALIDADES_FILE_PATH,
  safeReadJson,
  safeWriteJson,
});
