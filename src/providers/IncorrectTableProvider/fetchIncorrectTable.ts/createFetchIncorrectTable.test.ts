import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { createFetchIncorrectTable } from "./createFetchIncorrectTable.ts";

Deno.test("createFetchIncorrectTable", async (t) => {
  await t.step("Should fetch", async () => {
    const fetchIncorrectTable = createFetchIncorrectTable({
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
        idmunicipionasc: "idmunicipionasc example",
        idufnasc: "idufnasc example",
      }]),
    );
  });
});
