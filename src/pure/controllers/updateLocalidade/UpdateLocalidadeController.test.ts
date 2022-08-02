import { assertEquals } from "@/deps.ts";
import { Result } from "@/pure/kinds/Result.ts";
import { CorrectLocalidade } from "@/pure/models/CorrectLocalidade.ts";
import { Distritos } from "@/pure/models/Distrito.ts";
import { Localidade } from "@/pure/models/Localidade.ts";
import {
  FindOneDistritoByMunicipioId,
  QueryAllDistritos,
} from "@/pure/providers/DistritosProvider/IDistritosProvider.ts";
import { InsertCorrectLocalidade } from "@/pure/repositories/CorrectLocalidadesRepository/CorrectLocalidadesRepository.ts";
import {
  DeleteFirstIncorrectLocalidade,
  QueryFirstIncorrectLocalidade,
} from "@/pure/repositories/IncorrectLocalidadesRepository/IIncorrectLocalidadesRepository.ts";
import { Ask } from "@/pure/shared/ask/IAsk.ts";
import { Print } from "@/pure/shared/print/IPrint.ts";
import { InsertIgnoredLocalidade } from "@/pure/repositories/IgnoredLocalidadesRepository/IIgnoredLocalidadesRepository.ts";
import {
  UpdateLocalidadeControllerState,
  UpdateLocalidadesController,
} from "./createUpdateLocalidades.controller.ts";

Deno.test("UpdateLocalidadeController", async (t) => {
  await t.step("Should work in first time", async () => {
    const state = createFakeState(["0", "y"]);

    await UpdateLocalidadesController(state);

    assertEquals(state.incorrectLocalidadesFile, []);

    assertEquals(state.correctLocalidadesFile, [{
      incorrect: { municipio: "Porto velho", estado: "RO" },
      correct: { municipio: "Porto Velho", estado: "RO" },
    }]);
  });
  await t.step("Should ask again for a valid index", async () => {
    const state = createFakeState(["00", "0", "y"]);

    await UpdateLocalidadesController(state);

    assertEquals(state.incorrectLocalidadesFile, []);

    assertEquals(state.correctLocalidadesFile, [{
      incorrect: { municipio: "Porto velho", estado: "RO" },
      correct: { municipio: "Porto Velho", estado: "RO" },
    }]);
  });
  await t.step("Should ask manual insertion and confirmation", async () => {
    const state = createFakeState(["m", "1100205", "y"]);

    await UpdateLocalidadesController(state);

    assertEquals(state.incorrectLocalidadesFile, []);

    assertEquals(state.correctLocalidadesFile, [{
      incorrect: { municipio: "Porto velho", estado: "RO" },
      correct: { municipio: "Porto Velho", estado: "RO" },
    }]);
  });

  await t.step(
    "Should ask again manual insertion with confirmation",
    async () => {
      const state = createFakeState(["m", "wrongid", "1100205", "y"]);

      await UpdateLocalidadesController(state);

      assertEquals(state.incorrectLocalidadesFile, []);

      assertEquals(state.correctLocalidadesFile, [{
        incorrect: { municipio: "Porto velho", estado: "RO" },
        correct: { municipio: "Porto Velho", estado: "RO" },
      }]);
    },
  );
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
  insertIgnoredLocalidade: InsertIgnoredLocalidade<Error> = () => {
    throw new Error("Not implemented");
  };

  findOneDistritoByMunicipioId: FindOneDistritoByMunicipioId = async (
    id: string,
  ) => {
    await Promise.resolve();
    return this.distritos.find((distrito) => {
      return distrito["municipio-id"] === id;
    });
  };

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

function createFakeState(inputs: string[]) {
  return new State({
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
    inputs,
  });
}
