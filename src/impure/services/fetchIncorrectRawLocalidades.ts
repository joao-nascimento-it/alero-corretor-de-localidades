import { safeReadJson } from "@/impure/effects/safeReadJson.ts";
import { createFetchIncorrectRawLocalidades } from "@/pure/services/parseRawLocalidades/fetchIncorrectRawLocalidades.ts/createFetchIncorrectRawLocalidades.ts";

export const fetchIncorrectRawLocalidades = createFetchIncorrectRawLocalidades({
  safeReadJson,
});
