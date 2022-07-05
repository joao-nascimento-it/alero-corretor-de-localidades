import { z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import {
  createQueryAllItems,
  JsonRepositoryValidator,
} from "../JsonRepository/createJsonRepository.ts";

const IncorretaLocalidadesSchema = z.array(z.object({
  municipio: z.string(),
  estado: z.string(),
}));

export type IncorretaLocalidade = Readonly<{
  municipio: string;
  estado: string;
}>;

const createIncorretasLocalidadesValidator = (): JsonRepositoryValidator<
  IncorretaLocalidade
> =>
  async (data) => {
    const parsedData = await IncorretaLocalidadesSchema.safeParseAsync(data);
    if (!parsedData.success) {
      return Result.fail(parsedData.error);
    }

    return Result.done(parsedData.data);
  };

export const incorretaLocalidadesRepository = createQueryAllItems({
  path: "./private/incorretos.json",
  safeReadJson,
  validate: createIncorretasLocalidadesValidator(),
});
