import { assertEquals } from "@/deps.ts";
import { Result } from "../../kinds/Result.ts";
import { CorrectLocalidade } from "../../models/CorrectLocalidade.ts";
import {
  createDatabaseUpdateScript,
  toCorrectRefinedLocalidades,
} from "./createParseToDatabase.ts";

Deno.test("toCorrectRefinedLocalidades", () => {
  const correctRefinedLocalidades = toCorrectRefinedLocalidades([{
    incorrect: { estado: "DF", municipio: "brasilia" },
    correct: { estado: "DF", municipio: "Brasília" },
  }, {
    incorrect: { estado: "DF", municipio: "Ceilandia" },
    correct: { estado: "DF", municipio: "Brasília" },
  }]);

  assertEquals(correctRefinedLocalidades, [{
    incorrect: { estado: "DF", municipios: ["brasilia", "Ceilandia"] },
    correct: { estado: "DF", municipio: "Brasília" },
  }]);
});

Deno.test("createDatabaseUpdateScript", async () => {
  const store: {
    correctLocalidades: CorrectLocalidade[];
    databaseScript: string;
  } = {
    correctLocalidades: [{
      incorrect: {
        estado: "RO",
        municipio: "Porto velho",
      },
      correct: {
        estado: "RO",
        municipio: "Porto Velho",
      },
    }],
    databaseScript: "",
  };
  await createDatabaseUpdateScript({
    // deno-lint-ignore require-await
    async queryAllCorrectLocalidade() {
      return Result.done(store.correctLocalidades);
    },
    // deno-lint-ignore require-await
    async saveDatabaseScript(data) {
      store.databaseScript = data;
    },
  });
});
