import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { Localidade } from "@/models/Localidade.ts";
import { createSafeReadJson } from "../../shared/safeReadJson/createSafeReadJson.ts";
import { createSafeWriteJson } from "../../shared/safeWriteJson/createWriteJson.ts";
import { createParseRawLocalidades } from "./createParseRawLocalidades.ts";
import { createFetchIncorrectRawLocalidades } from "./fetchIncorrectRawLocalidades.ts/createFetchIncorrectRawLocalidades.ts";

Deno.test("createParseRawLocalidades", async () => {
  let destJsonFile = "";
  const sourceJsonFile = JSON.stringify({
    data: [{
      idmunicipionasc: "municipio example",
      idufnasc: "estado example",
      somethingElse: "somethingElse example",
    }],
  });

  const parseRawLocalidades = createParseRawLocalidades({
    fetchIncorrectRawLocalidades: createFetchIncorrectRawLocalidades({
      safeReadJson: createSafeReadJson({
        async readTextFile(path) {
          await Promise.resolve();
          assertEquals(path, "sourceExample.json");
          return sourceJsonFile;
        },
      }),
    }),
    safeWriteJson: createSafeWriteJson({
      async writeTextFile(path, data) {
        await Promise.resolve();
        assertEquals(path, "destExample.json");
        destJsonFile = data;
      },
    }),
  });

  const result = await parseRawLocalidades(
    "sourceExample.json",
    "destExample.json",
  );

  assertEquals(result, Result.done(undefined));
  assertEquals(
    sourceJsonFile,
    JSON.stringify({
      data: [{
        idmunicipionasc: "municipio example",
        idufnasc: "estado example",
        somethingElse: "somethingElse example",
      }],
    }),
  );
  assertEquals(
    destJsonFile,
    JSON.stringify([{
      municipio: "municipio example",
      estado: "estado example",
    }]),
  );
});
