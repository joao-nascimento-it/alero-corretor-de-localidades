import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { CorrectLocalidade } from "@/models/CorrectLocalidade.ts";
import { Distritos } from "@/models/Distrito.ts";
import { Localidade } from "@/models/Localidade.ts";
import { QueryAllDistritos } from "@/providers/DistritosProvider/IDistritosProvider.ts";
import { InsertCorrectLocalidade } from "@/repositories/CorrectLocalidadesRepository/CorrectLocalidadesRepository.ts";
import {
  DeleteFirstIncorrectLocalidade,
  QueryFirstIncorrectLocalidade,
} from "@/repositories/IncorrectLocalidadesRepository/IIncorrectLocalidadesRepository.ts";
import { Ask } from "@/shared/ask/IAsk.ts";
import { Print } from "@/shared/print/IPrint.ts";
import {
  UpdateLocalidadeControllerState,
  UpdateLocalidadesController,
} from "./createUpdateLocalidades.controller.ts";

Deno.test("UpdateLocalidadeController", async () => {
  const state = new State({
    distritos: [{
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
    }],
    incorrectLocalidadesFile: [{
      municipio: "Porto velho",
      estado: "RO",
    }],
    inputs: ["0"],
  });

  await UpdateLocalidadesController(state);

  assertEquals(state.incorrectLocalidadesFile, []);

  assertEquals(state.correctLocalidadesFile, [{
    incorrect: { municipio: "Porto velho", estado: "RO" },
    correct: { municipio: "Porto Velho", estado: "RO" },
  }]);
});

class State implements UpdateLocalidadeControllerState {
  distritos: Distritos;
  incorrectLocalidadesFile: Localidade[];
  correctLocalidadesFile: CorrectLocalidade[] = [];

  outputs: string[] = [];
  inputs: string[];
  constructor(
    initial: {
      inputs: string[];
      incorrectLocalidadesFile: Localidade[];
      distritos: Distritos;
    },
  ) {
    this.inputs = initial.inputs;
    this.incorrectLocalidadesFile = initial.incorrectLocalidadesFile;
    this.distritos = initial.distritos;
  }

  deleteFirstIncorrectLocalidade: DeleteFirstIncorrectLocalidade<Error> =
    async () => {
      await Promise.resolve();
      const [head, ...tail] = this.incorrectLocalidadesFile;
      this.incorrectLocalidadesFile = tail;
      return Result.done(head);
    };

  insertCorrectLocalidade: InsertCorrectLocalidade<Error> = async (
    correctLocalidade,
  ) => {
    await Promise.resolve();
    this.correctLocalidadesFile.push(correctLocalidade);
    return Result.done(correctLocalidade);
  };

  queryAllDistritos: QueryAllDistritos = async (): Promise<Distritos> => {
    await Promise.resolve();
    return this.distritos;
  };

  queryFirstIncorrectLocalidade: QueryFirstIncorrectLocalidade<Error> =
    async () => {
      await Promise.resolve();
      return Result.done(this.incorrectLocalidadesFile[0]);
    };

  print: Print = async (message: string) => {
    await Promise.resolve();
    this.outputs.push(message);
  };

  ask: Ask = async (message: string) => {
    await Promise.resolve();
    this.outputs.push(message);
    const item = this.inputs.shift();
    if (!item) {
      throw new Error(this.outputs + " has no input");
    }
    return item;
  };
}
