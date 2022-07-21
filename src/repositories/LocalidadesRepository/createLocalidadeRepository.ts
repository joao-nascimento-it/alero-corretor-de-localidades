import { z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import {
  createDeleteFirstItem,
  createInsertItem,
  createQueryAllItems,
  createQueryFirstItem,
  JsonRepositoryValidator,
} from "@/repositories/JsonRepository/createJsonRepository.ts";
import { Localidade } from "@/models/Localidade.ts";

const LocalidadesSchema = z.array(z.object({
  municipio: z.string(),
  estado: z.string(),
}));

const createValidateLocalidade = (): JsonRepositoryValidator<
  Localidade,
  Error
> =>
  async (data) => {
    const parsedData = await LocalidadesSchema.safeParseAsync(data);
    if (!parsedData.success) {
      return Result.fail(parsedData.error);
    }

    return Result.done(parsedData.data);
  };

const validate = createValidateLocalidade();

export function createQueryAllLocalidades<E>({
  path,
  safeReadJson,
}: {
  path: string;
  safeReadJson: SafeReadJson<E>;
}) {
  return createQueryAllItems<Localidade, E | Error>({
    path,
    safeReadJson,
    validate,
  });
}

export function createQueryFirstLocalidade<E>({
  path,
  safeReadJson,
}: {
  path: string;
  safeReadJson: SafeReadJson<E>;
}) {
  return createQueryFirstItem<Localidade, E | Error>({
    path,
    safeReadJson,
    validate,
  });
}

export function createInsertLocalidade<E>({
  path,
  safeReadJson,
  safeWriteJson,
}: {
  path: string;
  safeReadJson: SafeReadJson<E>;
  safeWriteJson: SafeWriteJson<E>;
}) {
  return createInsertItem<Localidade, E | Error>({
    path,
    safeReadJson,
    validate,
    safeWriteJson,
  });
}
export function createDeleteFirstLocalidade<E>(state: {
  path: string;
  safeReadJson: SafeReadJson<E>;
  safeWriteJson: SafeWriteJson<E>;
}) {
  return createDeleteFirstItem<Localidade, E | Error>({
    ...state,
    validate,
  });
}
