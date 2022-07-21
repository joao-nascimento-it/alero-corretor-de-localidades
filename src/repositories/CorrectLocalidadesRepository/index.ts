import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { safeWriteJson } from "@/shared/safeWriteJson/index.ts";
import {
  createInsertItem,
  JsonRepositoryValidator,
} from "../JsonRepository/createJsonRepository.ts";
import { Result } from "@/kinds/Result.ts";
import { z } from "@/deps.ts";
import { CorrectLocalidade } from "@/models/CorrectLocalidade.ts";

const CORRECT_LOCALIDADES_FILE_PATH = "./private/corretos.json";

const LocalidadeSchema = z.object({
  municipio: z.string(),
  estado: z.string(),
});

const CorrectLocalidadesSchema = z.array(z.object({
  incorrect: LocalidadeSchema,
  correct: LocalidadeSchema,
}));

const validate: JsonRepositoryValidator<CorrectLocalidade, Error> = async (
  data,
) => {
  const parsedData = await CorrectLocalidadesSchema.safeParseAsync(data);
  if (!parsedData.success) {
    return Result.fail(parsedData.error);
  }

  return Result.done(parsedData.data);
};

export const insertCorrectLocalidade = createInsertItem({
  path: CORRECT_LOCALIDADES_FILE_PATH,
  safeReadJson,
  safeWriteJson,
  validate,
});
