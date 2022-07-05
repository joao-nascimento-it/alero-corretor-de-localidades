import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createQueryFirstLocalidade } from "../LocalidadesRepository/createLocalidadeRepository.ts";

export const queryFirstCorretaLocalidade = createQueryFirstLocalidade({
  path: "./private/incorretos.json",
  safeReadJson,
});
