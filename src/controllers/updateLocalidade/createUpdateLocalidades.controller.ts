import {
  DeleteFirstIncorrectLocalidade,
  QueryFirstIncorrectLocalidade,
} from "@/repositories/IncorrectLocalidadesRepository/IIncorrectLocalidadesRepository.ts";
import { Localidade } from "@/models/Localidade.ts";
import {
  FindOneDistritoByMunicipioId,
  QueryAllDistritos,
} from "@/providers/DistritosProvider/IDistritosProvider.ts";
import { Print } from "@/shared/print/IPrint.ts";
import { Ask } from "@/shared/ask/IAsk.ts";
import { Result } from "@/kinds/Result.ts";
import { Distrito, Distritos } from "@/models/Distrito.ts";
import { filterSimilarDistritosByName } from "@/providers/DistritosProvider/createDistritosProvider.ts";
import { InsertCorrectLocalidade } from "@/repositories/CorrectLocalidadesRepository/CorrectLocalidadesRepository.ts";
import { InsertIgnoredLocalidade } from "@/repositories/IgnoredLocalidadesRepository/IIgnoredLocalidadesRepository.ts";

function getSugestionQuestion(
  incorrectLocalidade: Localidade,
  similarDistritos: Distritos,
) {
  const orderedDistritos = similarDistritos
    .slice(0, 10)
    .map((distrito, index) => {
      return `${index}: { distrito: ${distrito["distrito-nome"]}, municipio: ${
        distrito["municipio-nome"]
      }, estado: ${distrito["UF-sigla"]} };`;
    }).join("\n");

  return `Qual a localidade correta para { municipio: ${incorrectLocalidade.municipio}, estado: ${incorrectLocalidade.estado} }?\n${orderedDistritos}`;
}

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

interface AskSugestionState {
  ask: Ask;
}

async function askSugestion(
  state: AskSugestionState,
  incorrectLocalidade: Localidade,
  similarDistritos: Distritos,
) {
  const sugestionQuestion = getSugestionQuestion(
    incorrectLocalidade,
    similarDistritos,
  );

  return await state.ask(
    sugestionQuestion +
      "\n'm' para manual, 'i' para ignorar ou 0 a 9 para sugestão\nResposta:",
  );
}

interface AskManualSugestionState {
  print: Print;
  ask: Ask;
  findOneDistritoByMunicipioId: FindOneDistritoByMunicipioId;
}

async function askManualSugestion(
  state: AskManualSugestionState,
  incorrectLocalidade: Localidade,
): Promise<Distrito> {
  manualSugestionLoop:
  while (true) {
    const municipioId = await state.ask(
      `Qual o id de municipio correto para a localidade: { municipio: ${incorrectLocalidade.municipio}, estado: ${incorrectLocalidade.estado} }?\nResposta:`,
    );
    const distrito = await state.findOneDistritoByMunicipioId(municipioId);
    if (!distrito) {
      await state.print(
        "----------------\nMunicipio não existe, por favor digite um correto!",
      );
      continue manualSugestionLoop;
    }

    confirmationloop:
    while (true) {
      const confirmation = await state.ask(
        `Deseja confirmar a mudança\nde: { municipio: ${incorrectLocalidade.municipio}, estado: ${incorrectLocalidade.estado} }\npara: { municipio: ${
          distrito["municipio-nome"]
        }, estado: ${distrito["UF-sigla"]} }?\nReposta y/n: `,
      );

      if (confirmation === "n") {
        await state.print("----------------\nTudo bem, responda novamente!");
        continue manualSugestionLoop;
      }

      if (confirmation !== "y") {
        await state.print(
          "----------------\nSomente 'y' ou 'n' como resposta!",
        );
        continue confirmationloop;
      }

      await state.print("----------------\nCerto...");
      return distrito;
    }
  }
}

interface GetSugestionState extends AskSugestionState, AskManualSugestionState {
  print: Print;
}
async function getSugestion(
  state: GetSugestionState,
  incorrectLocalidade: Localidade,
  similarDistritos: Distritos,
): Promise<Result<Localidade, Error | "i">> {
  getSugestionLoop:
  while (true) {
    const sugestionIndex = await askSugestion(
      state,
      incorrectLocalidade,
      similarDistritos,
    );

    if (sugestionIndex === "m") {
      const distrito = await askManualSugestion(state, incorrectLocalidade);
      return Result.done({
        municipio: distrito["municipio-nome"],
        estado: distrito["UF-sigla"],
      });
    }

    if (sugestionIndex === "i") {
      return Result.fail("i");
    }

    if (!isValidResponse(sugestionIndex)) {
      await state.print(
        "----------------\nNão existe essa opção, digite somente de 0 a 9 ou 'm' para manual e 'i' para ignorar",
      );
      continue;
    }

    const distrito = similarDistritos[parseInt(sugestionIndex)];

    if (!distrito) {
      throw new RangeError(parseInt(sugestionIndex).toString());
    }

    confirmationloop:
    while (true) {
      const confirmation = await state.ask(
        `Deseja confirmar a mudança\nde: { municipio: ${incorrectLocalidade.municipio}, estado: ${incorrectLocalidade.estado} }\npara: { municipio: ${
          distrito["municipio-nome"]
        }, estado: ${distrito["UF-sigla"]} }?\nReposta y/n: `,
      );

      if (confirmation === "n") {
        await state.print("----------------\nTudo bem, responda novamente!");
        continue getSugestionLoop;
      }

      if (confirmation !== "y") {
        await state.print(
          "----------------\nSomente 'y' ou 'n' como resposta!",
        );
        continue confirmationloop;
      }

      await state.print("----------------\nCerto...");
      return Result.done({
        municipio: distrito["municipio-nome"],
        estado: distrito["UF-sigla"],
      });
    }
  }
}

interface UpdateLocalidadeState extends GetSugestionState {
  queryFirstIncorrectLocalidade: QueryFirstIncorrectLocalidade<Error>;
  deleteFirstIncorrectLocalidade: DeleteFirstIncorrectLocalidade<Error>;
  insertCorrectLocalidade: InsertCorrectLocalidade<Error>;
  insertIgnoredLocalidade: InsertIgnoredLocalidade<Error>;
}

async function updateLocalidade(
  state: UpdateLocalidadeState,
  distritos: Distritos,
): Promise<Result<void, Error>> {
  const incorrectLocalidadeResult = await state
    .queryFirstIncorrectLocalidade();

  if (incorrectLocalidadeResult.isFail()) {
    return incorrectLocalidadeResult;
  }

  const incorrectLocalidade = incorrectLocalidadeResult.value;

  if (!incorrectLocalidade) {
    return Result.fail(Error("Nenhuma localidade encontrada"));
  }

  const similarDistritos = filterSimilarDistritosByName(
    incorrectLocalidade.municipio,
    distritos,
  ).slice(0, 10);

  const sugestion = await getSugestion(
    state,
    incorrectLocalidade,
    similarDistritos,
  );

  if (sugestion.isFail()) {
    const value = sugestion.value;
    if (value === "i") {
      await state.insertIgnoredLocalidade(incorrectLocalidade);
    }
    if (value instanceof Error) {
      return Result.fail(value);
    }
  } else {
    const insertedCorrectLocalidade = await state.insertCorrectLocalidade({
      incorrect: incorrectLocalidade,
      correct: sugestion.value,
    });

    if (insertedCorrectLocalidade.isFail()) {
      return insertedCorrectLocalidade;
    }
  }

  const deletedIncorrectLocalidade = await state
    .deleteFirstIncorrectLocalidade();

  if (deletedIncorrectLocalidade.isFail()) {
    return Result.fail(Error("Failed to delete incorrect localidade"));
  }
  return Result.done(undefined);
}

// deno-lint-ignore no-empty-interface
interface UpdateLocalidadeLoopState extends UpdateLocalidadeState {
}

async function updateLocalidadeLoop(
  state: UpdateLocalidadeControllerState,
  distritos: Distritos,
) {
  while (true) {
    const result = await updateLocalidade(state, distritos);
    if (result.isFail()) {
      return result;
    }
  }
}

export interface UpdateLocalidadeControllerState
  extends UpdateLocalidadeLoopState {
  queryAllDistritos: QueryAllDistritos;
}

export async function UpdateLocalidadesController(
  state: UpdateLocalidadeControllerState,
) {
  const distritos = await state.queryAllDistritos();
  await updateLocalidadeLoop(state, distritos);
}
