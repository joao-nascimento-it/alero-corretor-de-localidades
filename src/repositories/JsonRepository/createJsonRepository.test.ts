import { assertEquals } from "@src/deps.ts";
import { Result } from "../../kinds/Result.ts";

import { createQueryAllItems } from "./createJsonRepository.ts";

Deno.test("FakeJsonRepository should query All", async () => {
  const queryAllItems = createQueryAllItems({
    path: "teste.json",
    async safeReadJson(path) {
      assertEquals(path, "teste.json");

      return await Result.done(["Item"]);
    },
  });

  const items = await queryAllItems();

  assertEquals(items, Result.done(["Item"]));
});
