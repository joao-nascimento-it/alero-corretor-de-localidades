import { ParseRawLocalidadesService } from "@/pure/services/parseRawLocalidades/IParseRawLocalidades.service.ts";
import { Ask } from "@/pure/shared/ask/IAsk.ts";
import { Print } from "@/pure/shared/print/IPrint.ts";

export const createParseRawLocalidadesController = <E>(
  parseRawLocalidadesService: ParseRawLocalidadesService<E>,
  print: Print,
  ask: Ask,
) =>
async () => {
  let source: string;
  let dest: string;
  while (true) {
    source = await ask("Qual o json de origem?\nResposta: ./private/");
    dest = await ask("Qual o json de destino?\nResposta: ./private/");
    break;
  }

  const result = await parseRawLocalidadesService(
    "./private/" + source,
    "./private/" + dest,
  );

  if (result.isFail()) {
    await print("Por favor, algum erro ocorreu" + result.value);
    return;
  }

  await print(`${dest} criado com sucesso a partir de ${source}`);
};
