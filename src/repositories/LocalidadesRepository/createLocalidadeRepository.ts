import { z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import {
  createInsertItem,
  createQueryAllItems,
  createQueryFirstItem,
  JsonRepositoryValidator,
} from "@/repositories/JsonRepository/createJsonRepository.ts";

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

export function createInsertLocalidade({
  path,
  safeReadJson,
  safeWriteJson,
}: {
  path: string;
  safeReadJson: SafeReadJson;
  safeWriteJson: SafeWriteJson;
}) {
  return createInsertItem({
    path,
    safeReadJson,
    validate,
    safeWriteJson,
  });
}
