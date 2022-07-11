import { Result } from "@/kinds/Result.ts";
import { Localidades } from "@/models/Localidade.ts";

export type FetchIncorrectRawLocalidades = (
  path: string,
) => Promise<Result<Localidades, Error>>;
