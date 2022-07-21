import {
  DeleteFirstIncorrectLocalidade,
  QueryFirstIncorrectLocalidade,
} from "@/repositories/IncorrectLocalidadesRepository/IIncorrectLocalidadesRepository.ts";
import { Localidade } from "@/models/Localidade.ts";
import {
  QueryAllDistritos,
} from "@/providers/DistritosProvider/IDistritosProvider.ts";
import { Print } from "@/shared/print/IPrint.ts";
import { Ask } from "@/shared/ask/IAsk.ts";
import { Result } from "@/kinds/Result.ts";
import { Distritos } from "@/models/Distrito.ts";
import { filterSimilarDistritosByName } from "@/providers/DistritosProvider/createDistritosProvider.ts";
import { InsertCorrectLocalidade } from "@/repositories/CorrectLocalidadesRepository/CorrectLocalidadesRepository.ts";

function getSugestionQuestion(
  incorrectLocalidade: Localidade,
  similarDistritos: Distritos,
) {
  const orderedDistritos = similarDistritos
    .slice(0, 9)
    .map((distrito, index) =>
      `${index}: {
        distrito: ${distrito["distrito-nome"]},
        municipio: ${distrito["municipio-nome"]},
        estado: ${distrito["UF-sigla"]},
      }`
    ).join("\n");

  return `Qual o municipio correto para {
    estado: ${incorrectLocalidade.estado},
    municipio: ${incorrectLocalidade.municipio}
  }?
  ${orderedDistritos}`;
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
  print: Print;
  ask: Ask;
}

async function askSugestion(
  incorrectLocalidade: Localidade,
  similarDistritos: Distritos,
  state: AskSugestionState,
) {
  const sugestionQuestion = getSugestionQuestion(
    incorrectLocalidade,
    similarDistritos,
  );

  await state.print(sugestionQuestion);

  return await state.ask("Resposta: ");
}

interface GetSugestionState extends AskSugestionState {
  print: Print;
}

async function getSugestion(
  incorrectLocalidade: Localidade,
  similarDistritos: Distritos,
  state: GetSugestionState,
): Promise<Result<Localidade, Error>> {
  while (true) {
    const sugestionIndex = await askSugestion(
      incorrectLocalidade,
      similarDistritos,
      state,
    );

    if (!isValidResponse(sugestionIndex)) {
      await state.print(
        "Não existe essa opção, por favor, digite uma opção valida!",
      );
      continue;
    }

    const distrito = similarDistritos[parseInt(sugestionIndex)];

    if (!distrito) {
      throw new RangeError(parseInt(sugestionIndex).toString());
    }

    return Result.done({
      municipio: distrito["municipio-nome"],
      estado: distrito["UF-sigla"],
    });
  }
}

interface UpdateLocalidadeState extends GetSugestionState {
  queryFirstIncorrectLocalidade: QueryFirstIncorrectLocalidade<Error>;
  deleteFirstIncorrectLocalidade: DeleteFirstIncorrectLocalidade<Error>;
  insertCorrectLocalidade: InsertCorrectLocalidade<Error>;
}

async function updateLocalidade(
  distritos: Distritos,
  state: UpdateLocalidadeState,
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
  ).slice(0, 9);

  const sugestion = await getSugestion(
    incorrectLocalidade,
    similarDistritos,
    state,
  );

  if (sugestion.isFail()) {
    return sugestion;
  }

  const insertedCorrectLocalidade = await state.insertCorrectLocalidade({
    incorrect: incorrectLocalidade,
    correct: sugestion.value,
  });

  if (insertedCorrectLocalidade.isFail()) {
    return insertedCorrectLocalidade;
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
  distritos: Distritos,
  state: UpdateLocalidadeControllerState,
) {
  while (true) {
    const result = await updateLocalidade(distritos, state);
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
  await updateLocalidadeLoop(distritos, state);
}
