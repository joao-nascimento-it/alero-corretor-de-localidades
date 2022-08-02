import {
  CorrectLocalidade,
  CorrectLocalidades,
} from "@/pure/models/CorrectLocalidade.ts";
import { QueryAllCorrectLocalidade } from "../../repositories/CorrectLocalidadesRepository/CorrectLocalidadesRepository.ts";

type CorrectRefinedLocalidade = Readonly<{
  incorrect: {
    municipios: string[];
    estado: string;
  };
  correct: {
    municipio: string;
    estado: string;
  };
}>;

type CorrectRefinedLocalidades = ReadonlyArray<CorrectRefinedLocalidade>;

export function toCorrectRefinedLocalidades(
  correctLocalidades: CorrectLocalidades,
): CorrectRefinedLocalidades {
  const state: CorrectRefinedLocalidade[] = [];
  for (const item of correctLocalidades) {
    let someChangeInMunicipios = false;
    for (const correctRefinedLocalidade of state) {
      if (isEqualResultado(item, correctRefinedLocalidade)) {
        correctRefinedLocalidade.incorrect.municipios
          .push(item.incorrect.municipio);
        someChangeInMunicipios = true;
        break;
      }
    }
    if (!someChangeInMunicipios) {
      state.push({
        incorrect: {
          municipios: [item.incorrect.municipio],
          estado: item.incorrect.estado,
        },
        correct: item.correct,
      });
      continue;
    }
  }
  return state;
}

function toDatabaseScript(
  correctRefinedLocalidades: CorrectRefinedLocalidades,
) {
  return correctRefinedLocalidades.map((item) => {
    return `corrige(
      [${
      item.incorrect.municipios.map((municipio) => `"${municipio}"`).join(", ")
    }],
      ["${item.incorrect.estado}"],
      "${item.correct.municipio}",
      "${item.correct.estado}"
    );`;
  }).join("\n");
}

function convertCorrectLocalidadesToDatabaseScript(
  correctLocalidades: CorrectLocalidades,
) {
  return toDatabaseScript(toCorrectRefinedLocalidades(correctLocalidades));
}

interface CreateDatabaseUpdateScriptDeps {
  queryAllCorrectLocalidade: QueryAllCorrectLocalidade<Error>;
  saveDatabaseScript(data: string): Promise<void>;
}

export async function createDatabaseUpdateScript(
  deps: CreateDatabaseUpdateScriptDeps,
) {
  const correctLocalidadesResult = await deps.queryAllCorrectLocalidade();

  if (correctLocalidadesResult.isFail()) {
    throw correctLocalidadesResult.value;
  }

  const correctLocalidades = correctLocalidadesResult.value;

  const databaseScript = convertCorrectLocalidadesToDatabaseScript(
    correctLocalidades,
  );

  await deps.saveDatabaseScript(databaseScript);
}

function isEqualResultado(
  a: CorrectLocalidade,
  b: CorrectRefinedLocalidade,
): boolean {
  return a.correct.estado === b.correct.estado &&
    a.correct.municipio === b.correct.municipio &&
    a.incorrect.estado === b.incorrect.estado;
}
