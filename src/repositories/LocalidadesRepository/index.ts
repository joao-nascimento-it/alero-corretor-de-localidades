import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createQueryAllLocalidades } from "./createLocalidadeRepository.ts";

export const queryAllLocalidades = createQueryAllLocalidades({
  path: "./private/incorretos.json",
  safeReadJson,
});
