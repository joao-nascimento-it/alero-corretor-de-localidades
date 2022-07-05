import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createQueryAllIncorretaLocalidades } from "./createIncorretaLocalidadeRepository.ts";

export const queryAllIncorretaLocalidades = createQueryAllIncorretaLocalidades({
  path: "./private/incorretos.json",
  safeReadJson,
});
