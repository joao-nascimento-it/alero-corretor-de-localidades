import { assertEquals, assertStrictEquals } from "@src/deps.ts";
import { Result } from "@src/kinds/Result.ts";
import { createSafeWriteJson } from "./createWriteJson.ts";

Deno.test("createSafeWriteJson should write file", async () => {
  let file: string = "";

  const safeWriteJson = createSafeWriteJson({
    async writeTextFile(path, data) {
      await Promise.resolve();
      assertEquals(path, "file.json");
      file = data;
    },
  });

  const result = await safeWriteJson("file.json", "Hello World");

  assertEquals(result, Result.done(undefined));
  assertEquals(file, JSON.stringify("Hello World"));
});
