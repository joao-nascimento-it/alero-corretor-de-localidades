import { assertEquals } from "@/deps.ts";
import { createParseRawLocalidadesService } from "../../services/parseRawLocalidades/createParseRawLocalidades.ts";
import { createFetchIncorrectRawLocalidades } from "../../services/parseRawLocalidades/fetchIncorrectRawLocalidades.ts/createFetchIncorrectRawLocalidades.ts";
import { Ask } from "../../shared/ask/IAsk.ts";
import { Print } from "../../shared/print/IPrint.ts";
import { createSafeReadJson } from "../../shared/safeReadJson/createSafeReadJson.ts";
import { createSafeWriteJson } from "../../shared/safeWriteJson/createWriteJson.ts";
import { createParseRawLocalidadesController } from "./parseRawLocalidades.controller.ts";

Deno.test("parseRawLocalidadesController", async () => {
  const { parseRawLocalidadesController, state } = fakeParseRawLocalidades([
    "src.json",
    "dest.json",
  ]);
  await parseRawLocalidadesController();

  assertEquals(state.destFile, JSON.stringify([]));
  assertEquals(state.srcFile, JSON.stringify({ data: [] }));
  assertEquals(state.inputs, []);
  assertEquals(state.outputs, [
    "Qual o json de origem?\nResposta: ./private/",
    "Qual o json de destino?\nResposta: ./private/",
    "dest.json criado com sucesso a partir de src.json",
  ]);
});

function fakeParseRawLocalidades(inputs: string[]) {
  const state = {
    destFile: JSON.stringify([]),
    srcFile: JSON.stringify({ data: [] }),
    inputs,
    outputs: [] as string[],
  };

  const safeWriteJson = createSafeWriteJson({
    async writeTextFile(path, data) {
      if (path !== "./private/dest.json") {
        throw new Error("File " + path + " does not exist");
      }
      state.destFile = await data;
    },
  });

  const safeReadJson = createSafeReadJson({
    async readTextFile(path) {
      if (path !== "./private/src.json") {
        throw new Error("File " + path + " does not exist");
      }
      return await state.srcFile;
    },
  });

  const fetchIncorrectRawLocalidades = createFetchIncorrectRawLocalidades({
    safeReadJson,
  });

  const print: Print = async (message) => {
    await Promise.resolve();
    state.outputs.push(message);
  };

  const ask: Ask = async (message) => {
    await Promise.resolve();
    state.outputs.push(message);
    return state.inputs.shift() ?? "";
  };

  const parseRawLocalidadesController = createParseRawLocalidadesController(
    createParseRawLocalidadesService({
      safeWriteJson,
      fetchIncorrectRawLocalidades,
    }),
    print,
    ask,
  );

  return { state, parseRawLocalidadesController };
}
