import { assertEquals } from "@src/deps.ts";
import { Result } from "../../kinds/Result.ts";
import { SafeWriteJson } from "../../shared/safeWriteJson/ISafeWriteJson.ts";

import {
  createInsertItem,
  createQueryAllItems,
} from "./createJsonRepository.ts";

Deno.test("FakeJsonRepository should query All", async () => {
  const queryAllItems = createQueryAllItems({
    path: "file.json",
    async safeReadJson(path) {
      assertEquals(path, "file.json");

      return await Result.done(["Item"]);
    },
  });

  const items = await queryAllItems();

  assertEquals(items, Result.done(["Item"]));
});

Deno.test("FakeJsonRepository should insert item", async () => {
  let database: string[] = [];

  const insertItem = createInsertItem({
    path: "file.json",
    async safeReadJson(path) {
      await Promise.resolve();
      assertEquals(path, "file.json");
      return Result.done(database);
    },
    async safeWriteJson(path, data) {
      await Promise.resolve();
      assertEquals(path, "file.json");
      database = data;
      return Result.done(undefined);
    },
  });

  const result = await insertItem("Item");

  assertEquals(result, Result.done("Item"));

  assertEquals(database, ["Item"]);
});

const createFakeSafeWriteJson = ({
  database,
}: {
  database: any[];
}): SafeWriteJson =>
  async (path, data) => {
    await Promise.resolve();
    assertEquals(path, "file.json");
    database = data;
    return Result.done(undefined);
  };
