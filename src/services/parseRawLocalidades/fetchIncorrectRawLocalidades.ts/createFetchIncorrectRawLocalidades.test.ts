import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { createFetchIncorrectRawLocalidades } from "./createFetchIncorrectRawLocalidades.ts";

Deno.test("createFetchIncorrectRawLocalidades", async (t) => {
  await t.step("Should fetch", async () => {
    const fetchIncorrectTable = createFetchIncorrectRawLocalidades({
      async safeReadJson(path) {
        await Promise.resolve();

        assertEquals(path, "file.json");

        return Result.done({
          data: [{
            idmunicipionasc: "idmunicipionasc example",
            idufnasc: "idufnasc example",
            somethingElse: "somethingElse example",
          }],
        });
      },
    });

    const incorrectTable = await fetchIncorrectTable("file.json");

    assertEquals(
      incorrectTable,
      Result.done([{
        municipio: "idmunicipionasc example",
        estado: "idufnasc example",
      }]),
    );
  });
});
