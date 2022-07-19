import { Result } from "../../kinds/Result.ts";
import { Distritos } from "../../models/Distrito.ts";
import { QueryAllDistritos } from "../../providers/DistritosProvider/IDistritosProvider.ts";
import { QueryFirstIncorrectLocalidade } from "../../repositories/IncorrectLocalidadesRepository/IIncorrectLocalidadesRepository.ts";
import { Ask } from "../../shared/ask/IAsk.ts";
import { Print } from "../../shared/print/IPrint.ts";
import {
  UpdateLocalidadeControllerState,
  UpdateLocalidadesController,
} from "./createUpdateLocalidades.controller.ts";

Deno.test("UpdateLocalidadeController", async () => {
  const state = new State([]);
  await UpdateLocalidadesController(state);
});

class State implements UpdateLocalidadeControllerState {
  distritos: Distritos = [{
    "distrito-id": "120040105",
    "distrito-nome": "Rio Branco",
    "municipio-id": "1200401",
    "municipio-nome": "Rio Branco",
    "UF-id": "12",
    "UF-sigla": "AC",
  }, {
    "distrito-id": "110020505",
    "distrito-nome": "Porto Velho",
    "municipio-id": "1100205",
    "municipio-nome": "Porto Velho",
    "UF-id": "11",
    "UF-sigla": "RO",
  }];
  outputs: string[] = [];

  constructor(public inputs: string[]) {
  }

  queryAllDistritos: QueryAllDistritos = async (): Promise<Distritos> => {
    await Promise.resolve();
    return this.distritos;
  };
  queryFirstIncorrectLocalidade: QueryFirstIncorrectLocalidade<Error> =
    async () => {
      await Promise.resolve();
      return Result.done({ municipio: "Porto velho", estado: "RO" });
    };

  print: Print = async (message: string) => {
    await Promise.resolve();
    this.outputs.push(message);
  };

  ask: Ask = async (message: string) => {
    await Promise.resolve();
    this.outputs.push(message);
    return this.inputs.shift() ?? "";
  };
}
