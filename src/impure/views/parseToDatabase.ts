import { queryAllCorrectLocalidade } from "@/impure/repositories/correctLocalidade.repository.ts";
import { createDatabaseUpdateScript } from "@/pure/controllers/parseToDatabase/createParseToDatabase.ts";

await createDatabaseUpdateScript({
  queryAllCorrectLocalidade,
  // deno-lint-ignore require-await
  async saveDatabaseScript(data) {
    Deno.writeTextFile("./private/databaseScript.txt", data);
  },
});
