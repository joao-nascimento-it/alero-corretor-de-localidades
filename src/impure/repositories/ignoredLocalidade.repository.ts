import { safeReadJson } from "@/impure/effects/safeReadJson.ts";
import { safeWriteJson } from "@/impure/effects/safeWriteJson.ts";
import {
  createInsertLocalidade,
} from "@/pure/repositories/LocalidadesRepository/createLocalidadeRepository.ts";

const IGNORED_LOCALIDADES_FILE_PATH = "./private/ignorados.json";

export const insertIgnoredLocalidade = createInsertLocalidade({
  path: IGNORED_LOCALIDADES_FILE_PATH,
  safeReadJson,
  safeWriteJson,
});
