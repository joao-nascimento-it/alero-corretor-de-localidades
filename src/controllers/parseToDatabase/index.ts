import { queryAllCorrectLocalidade } from "@/repositories/CorrectLocalidadesRepository/index.ts";
import { createDatabaseUpdateScript } from "./createParseToDatabase.ts";

await createDatabaseUpdateScript({
  queryAllCorrectLocalidade,
  // deno-lint-ignore require-await
  async saveDatabaseScript(data) {
    Deno.writeTextFile("./private/databaseScript.txt", data);
  },
});
