import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createQueryFirstLocalidade } from "../LocalidadesRepository/createLocalidadeRepository.ts";

export const queryFirstIncorretaLocalidade = createQueryFirstLocalidade({
  path: "./private/incorretos.json",
  safeReadJson,
});
