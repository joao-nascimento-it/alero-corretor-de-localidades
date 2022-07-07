import { z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { Localidades } from "@/models/Localidade.ts";

type CreateFetchIncorrectRawLocalidades = (deps: {
  safeReadJson: SafeReadJson;
}) => (path: string) => Promise<Result<Localidades, Error>>;

const ErrorsJsonFileSchema = z.object({
  data: z.array(
    z.object({
      idmunicipionasc: z.string(),
      idufnasc: z.string(),
    }),
  ),
});

export const createFetchIncorrectRawLocalidades:
  CreateFetchIncorrectRawLocalidades = ({
    safeReadJson,
  }) =>
    async (path): Promise<Result<Localidades, Error>> => {
      const data = await safeReadJson(path);

      if (data.isFail()) {
        return Result.fail(data.value);
      }

      const parsedData = await ErrorsJsonFileSchema.safeParseAsync(data.value);

      if (!parsedData.success) {
        return Result.fail(parsedData.error);
      }

      const refinedData = parsedData.data.data.map(({
        idmunicipionasc,
        idufnasc,
      }) => ({
        municipio: idmunicipionasc,
        estado: idufnasc,
      }));

      return Result.done(refinedData);
    };
