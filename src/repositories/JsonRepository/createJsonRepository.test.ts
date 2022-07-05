import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";

import {
  createInsertItem,
  createQueryAllItems,
  createQueryFirstItem,
} from "./createJsonRepository.ts";

Deno.test("FakeJsonRepository should query All", async () => {
  const database = new FakeDatabase(["Item"]);

  const queryAllItems = createQueryAllItems({
    path: "file.json",
    safeReadJson: FakeDatabase.createFakeSafeReadJson(database),
  });

  const items = await queryAllItems();

  assertEquals(items, Result.done(["Item"]));
});

Deno.test("JsonRepository should insert item", async () => {
  const database = new FakeDatabase([]);

  const insertItem = createInsertItem({
    path: "file.json",
    safeReadJson: FakeDatabase.createFakeSafeReadJson(database),
    safeWriteJson: FakeDatabase.createFakeSafeWriteJson(database),
  });

  const result = await insertItem("Item");

  assertEquals(result, Result.done("Item"));
  assertEquals(database.array, ["Item"]);
});

Deno.test("JsonRepository should query first item", async () => {
  const database = new FakeDatabase(["Item"]);

  const queryFirstItem = createQueryFirstItem({
    path: "file.json",
    safeReadJson: FakeDatabase.createFakeSafeReadJson(database),
  });

  const itemResult = await queryFirstItem();

  assertEquals(itemResult, Result.done("Item"));
});

class FakeDatabase<T> {
  constructor(public array: T[]) {
  }

  static createFakeSafeWriteJson = <T>(
    database: FakeDatabase<T>,
  ): SafeWriteJson =>
    async (path, data) => {
      await Promise.resolve();
      assertEquals(path, "file.json");
      database.array = data;
      return Result.done(undefined);
    };

  static createFakeSafeReadJson = <T>(
    database: FakeDatabase<T>,
  ): SafeReadJson =>
    async (path) => {
      await Promise.resolve();
      assertEquals(path, "file.json");
      return Result.done(database.array);
    };
}
