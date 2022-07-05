import { z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";

import {
  createQueryAllItems,
  createQueryFirstItem,
  JsonRepositoryValidator,
} from "../JsonRepository/createJsonRepository.ts";

const LocalidadesSchema = z.array(z.object({
  municipio: z.string(),
  estado: z.string(),
}));

export type Localidade = Readonly<{
  municipio: string;
  estado: string;
}>;

const createValidateLocalidade = (): JsonRepositoryValidator<
  Localidade
> =>
  async (data) => {
    const parsedData = await LocalidadesSchema.safeParseAsync(data);
    if (!parsedData.success) {
      return Result.fail(parsedData.error);
    }

    return Result.done(parsedData.data);
  };

const validate = createValidateLocalidade();

export function createQueryAllLocalidades({
  path,
  safeReadJson,
}: {
  path: string;
  safeReadJson: SafeReadJson;
}) {
  return createQueryAllItems({
    path,
    safeReadJson,
    validate,
  });
}

export function createQueryFirstLocalidade({
  path,
  safeReadJson,
}: {
  path: string;
  safeReadJson: SafeReadJson;
}) {
  return createQueryFirstItem({
    path,
    safeReadJson,
    validate,
  });
}
