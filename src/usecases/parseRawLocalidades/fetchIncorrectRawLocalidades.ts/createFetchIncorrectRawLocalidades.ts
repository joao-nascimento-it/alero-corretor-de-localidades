import { z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { Localidades } from "@/models/Localidade.ts";

const ErrorsJsonFileSchema = z.object({
  data: z.array(
    z.object({
      idmunicipionasc: z.string(),
      idufnasc: z.string(),
    }),
  ),
});

export const createFetchIncorrectRawLocalidades = <E>({
  safeReadJson,
}: {
  safeReadJson: SafeReadJson<E>;
}) =>
  async (path: string): Promise<Result<Localidades, E | Error>> => {
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
