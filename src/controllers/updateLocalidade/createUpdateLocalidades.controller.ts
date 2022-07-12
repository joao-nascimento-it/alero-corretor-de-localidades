import { QueryFirstIncorrectLocalidade } from "@/repositories/IncorrectLocalidadesRepository/IIncorrectLocalidadesRepository.ts";
import { Localidade } from "@/models/Localidade.ts";
import { QuerySimilarDistritosByName } from "@/providers/DistritosProvider/IDistritosProvider.ts";
import { Print } from "@/shared/print/IPrint.ts";
import { Ask } from "@/shared/ask/IAsk.ts";
import { Result } from "@/kinds/Result.ts";

const createUpdateLocalidadesController = <E>(
  queryFirstIncorrectLocalidade: QueryFirstIncorrectLocalidade<E>,
  querySimilarDistritosByName: QuerySimilarDistritosByName,
  print: Print,
  ask: Ask,
) => {
  async function askSugestion(
    incorrectLocalidade: Localidade,
  ): Promise<Result<Localidade, Error>> {
    const similars = await querySimilarDistritosByName(
      incorrectLocalidade.municipio,
    );

    const orderedDistritos = similars
      .map((distrito, index) =>
        `${index}: {
          distrito: ${distrito["distrito-nome"]},
          municipio: ${distrito["municipio-nome"]},
          municipio: ${distrito["UF-sigla"]},
        }`
      ).join("\n");

    let distritoName: string;
    while (true) {
      await print(`Qual o municipio correto para {
          estado: ${incorrectLocalidade.estado},
          municipio: ${incorrectLocalidade.municipio}
        }?
        ${orderedDistritos}`);

      distritoName = await ask("Resposta: ");

      if (isValidResponse(distritoName)) {
        break;
      }

      await print("Não existe essa opção, por favor, digite uma opção valida!");
    }

    const distrito = similars[parseInt(distritoName)]!;

    if (!distrito) {
      throw new RangeError(parseInt(distritoName).toString());
    }

    return Result.done({
      municipio: distrito["municipio-nome"],
      estado: distrito["UF-sigla"],
    });
  }

  return async function updateLocalidade() {
    const incorrectLocalidadeResult = await queryFirstIncorrectLocalidade();

    if (incorrectLocalidadeResult.isFail()) {
      return incorrectLocalidadeResult;
    }
    const incorrectLocalidade = incorrectLocalidadeResult.value;

    if (!incorrectLocalidade) {
      return Result.fail(Error("Nenhuma localidade encontrada"));
    }

    const sugestionResult = await askSugestion(incorrectLocalidade);
    if (sugestionResult.isFail()) {
      return sugestionResult;
    }
    const nextLocalidade = sugestionResult.value;
    // deleteFirstIncorrectLocalidade()
    return;
  };
};

function isValidResponse(
  data: string,
): data is "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" {
  return data === "0" ||
    data === "1" ||
    data === "2" ||
    data === "3" ||
    data === "4" ||
    data === "5" ||
    data === "6" ||
    data === "7" ||
    data === "8" ||
    data === "9";
}
