import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createFetchIncorrectRawLocalidades } from "./createFetchIncorrectRawLocalidades.ts";

export const fetchIncorrectRawLocalidades = createFetchIncorrectRawLocalidades({
  safeReadJson,
});
