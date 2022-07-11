import { Result } from "@/kinds/Result.ts";
import { Distritos } from "@/models/Distrito.ts";
import { Localidade } from "@/models/Localidade.ts";
import { QuerySimilarDistritosByName } from "@/providers/DistritosProvider/IDistritosProvider.ts";
import { createAsk } from "../../shared/createAsk/createAsk.ts";

type Model = {
  state: "Initial";
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

const createAskDistrito = (
  { print, printAsk }: {
    print(message: string): Promise<void>;
    printAsk(message: string): Promise<string | null>;
  },
) => createAsk({ print, printAsk, parse });

interface QuestionContext<E> {
  ask(message: string): Promise<Result<string, E>>;
  print(message: string): Promise<void>;
  querySimilarDistritosByName: QuerySimilarDistritosByName;
}

async function askQuestion<E>({
  ask,
  print,
  querySimilarDistritosByName,
}: QuestionContext<E>, incorrectlocalidade: Localidade) {
  const similars = await querySimilarDistritosByName(
    incorrectlocalidade.municipio,
  );
  const orderedDistritos = similars
    .map((distrito, index) =>
      `${index}: {
      distrito: ${distrito["distrito-nome"]},
      municipio: ${distrito["municipio-nome"]},
      municipio: ${distrito["UF-sigla"]},
    }`
    ).join("\n");

  await print(`Qual o municipio correto para {
    estado: ${incorrectlocalidade.estado},
    municipio: ${incorrectlocalidade.municipio}
  }?
  ${orderedDistritos}`);

  const responseResult = await ask("Resposta: ");

  if (responseResult.isFail()) {
    return responseResult;
  }

  const data = responseResult.value;

  if (!isValidResponse(data)) {
    return Result.fail(undefined);
  }

  return;
}
