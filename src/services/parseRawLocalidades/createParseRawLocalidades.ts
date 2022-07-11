import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import { Result } from "../../kinds/Result.ts";
import { Localidades } from "../../models/Localidade.ts";
import { FetchIncorrectRawLocalidades } from "./fetchIncorrectRawLocalidades.ts/IFetchIncorrectRawLocalidade.ts";
import { ParseRawLocalidadesService } from "./IParseRawLocalidades.service.ts";

export const createParseRawLocalidadesService = <E>({
  safeWriteJson,
  fetchIncorrectRawLocalidades,
}: {
  safeWriteJson: SafeWriteJson<E>;
  fetchIncorrectRawLocalidades: FetchIncorrectRawLocalidades;
}): ParseRawLocalidadesService<E | Error> =>
  async (source: string, dest: string) => {
    const incorrectRawLocalidades = await fetchIncorrectRawLocalidades(source);

    if (incorrectRawLocalidades.isFail()) {
      return Result.fail(incorrectRawLocalidades.value);
    }

    const refined = incorrectRawLocalidades.value
      .reduce((state: Localidades, item) => {
        const repeated = state.some((innerItem) => {
          return item !== innerItem && innerItem.estado === item.estado &&
            innerItem.municipio === item.municipio;
        });

        return !repeated ? [...state, item] : state;
      }, []);

    return safeWriteJson(dest, refined);
  };
