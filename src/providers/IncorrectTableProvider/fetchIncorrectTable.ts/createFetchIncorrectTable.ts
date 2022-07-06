import { z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";

type IncorrectTable = ReadonlyArray<{
  idmunicipionasc: string;
  idufnasc: string;
}>;

type CreateFetchIncorrectTable = (deps: {
  safeReadJson: SafeReadJson;
}) => (path: string) => Promise<Result<IncorrectTable, Error>>;

const ErrorsJsonFileSchema = z.object({
  data: z.array(
    z.object({
      idmunicipionasc: z.string(),
      idufnasc: z.string(),
    }),
  ),
});

export const createFetchIncorrectTable: CreateFetchIncorrectTable = ({
  safeReadJson,
}) =>
  async (path) => {
    const data = await safeReadJson(path);

    if (data.isFail()) return data;

    const parsedData = await ErrorsJsonFileSchema.safeParseAsync(data.value);

    if (!parsedData.success) {
      return Result.fail(parsedData.error);
    }

    const refinedData = parsedData.data.data.map(({
      idmunicipionasc,
      idufnasc,
    }) => ({
      idmunicipionasc,
      idufnasc,
    }));

    return Result.done(refinedData);
  };
