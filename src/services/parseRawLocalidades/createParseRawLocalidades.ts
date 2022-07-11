import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import { Localidade, Localidades } from "../../models/Localidade.ts";
import { FetchIncorrectRawLocalidades } from "./fetchIncorrectRawLocalidades.ts/IFetchIncorrectRawLocalidade.ts";

export const createParseRawLocalidadesService = <E>({
  safeWriteJson,
  fetchIncorrectRawLocalidades,
}: {
  safeWriteJson: SafeWriteJson<E>;
  fetchIncorrectRawLocalidades: FetchIncorrectRawLocalidades;
}) =>
  async (source: string, dest: string) => {
    const incorrectRawLocalidades = await fetchIncorrectRawLocalidades(source);

    if (incorrectRawLocalidades.isFail()) {
      return incorrectRawLocalidades;
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
