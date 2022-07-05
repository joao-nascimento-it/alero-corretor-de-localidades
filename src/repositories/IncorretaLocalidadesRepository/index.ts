import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createIncorretaLocalidadesRepository } from "./createIncorretaLocalidadeRepository.ts";

export const incorretaLocalidadesRepository =
  createIncorretaLocalidadesRepository({
    path: "./private/incorretos.json",
    safeReadJson,
  });
