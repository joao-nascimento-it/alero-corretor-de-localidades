import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createQueryFirstLocalidade } from "../LocalidadesRepository/createLocalidadeRepository.ts";

export const queryFirstIgnoredLocalidade = createQueryFirstLocalidade({
  path: "./private/incorretos.json",
  safeReadJson,
});
