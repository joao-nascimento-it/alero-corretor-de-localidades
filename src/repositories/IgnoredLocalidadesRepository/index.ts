import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { safeWriteJson } from "@/shared/safeWriteJson/index.ts";
import {
  createInsertLocalidade,
} from "@/repositories/LocalidadesRepository/createLocalidadeRepository.ts";

const IGNORED_LOCALIDADES_FILE_PATH = "./private/incorretos.json";

export const insertIgnoredLocalidade = createInsertLocalidade({
  path: IGNORED_LOCALIDADES_FILE_PATH,
  safeReadJson,
  safeWriteJson,
});
