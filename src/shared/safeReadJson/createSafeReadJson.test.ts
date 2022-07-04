import { assertEquals } from "@src/deps.ts";
import { Result } from "@src/kinds/Result.ts";
import { createSafeReadJson } from "./createSafeReadJson.ts";

Deno.test("CreateSafeReadJson should readJson", async () => {
  const safeReadJson = createSafeReadJson({
    async readTextFile(path: string): Promise<string> {
      if (path !== "teste.json") {
        throw new Error("Wrong test path");
      }
      await Promise.resolve();

      return JSON.stringify("Hello World");
    },
  });
  const data = await safeReadJson("teste.json");
  assertEquals(data, Result.done("Hello World"));
});
