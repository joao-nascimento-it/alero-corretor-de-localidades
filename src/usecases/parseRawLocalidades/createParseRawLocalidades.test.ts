import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { createSafeReadJson } from "@/shared/safeReadJson/createSafeReadJson.ts";
import { createSafeWriteJson } from "@/shared/safeWriteJson/createWriteJson.ts";
import { createParseRawLocalidades } from "./createParseRawLocalidades.ts";
import { createFetchIncorrectRawLocalidades } from "./fetchIncorrectRawLocalidades.ts/createFetchIncorrectRawLocalidades.ts";

Deno.test("createParseRawLocalidades", async () => {
  const state = new State(
    JSON.stringify({
      data: [{
        idmunicipionasc: "municipio example",
        idufnasc: "estado example",
        somethingElse: "somethingElse example",
      }],
    }),
    "",
  );

  const parseRawLocalidades = createParseRawLocalidades({
    fetchIncorrectRawLocalidades: createFetchIncorrectRawLocalidades({
      safeReadJson: createSafeReadJson({
        readTextFile: state.readTextFile,
      }),
    }),
    safeWriteJson: createSafeWriteJson({
      writeTextFile: state.writeTextFile,
    }),
  });

  const result = await parseRawLocalidades(
    "sourceExample.json",
    "destExample.json",
  );

  assertEquals(result, Result.done(undefined));
  assertEquals(
    state.sourceFile,
    JSON.stringify({
      data: [{
        idmunicipionasc: "municipio example",
        idufnasc: "estado example",
        somethingElse: "somethingElse example",
      }],
    }),
  );
  assertEquals(
    state.destFile,
    JSON.stringify([{
      municipio: "municipio example",
      estado: "estado example",
    }]),
  );
});

class State {
  constructor(public sourceFile: string, public destFile: string) {}

  readTextFile: typeof Deno.readTextFile = async (path) => {
    await Promise.resolve();
    if (path === "sourceExample.json") {
      return this.sourceFile;
    }

    throw new Error("File does not exist");
  };

  writeTextFile: typeof Deno.writeTextFile = async (path, data) => {
    await Promise.resolve();
    if (path !== "destExample.json") {
      throw new Error("File does not exist");
    }
    this.destFile = data;
  };
}
