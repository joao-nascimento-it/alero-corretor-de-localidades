import { assertEquals } from "@src/deps.ts";
import { Result } from "../../kinds/Result.ts";
import { SafeReadJson } from "../../shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "../../shared/safeWriteJson/ISafeWriteJson.ts";

import {
  createInsertItem,
  createQueryAllItems,
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

Deno.test("FakeJsonRepository should insert item", async () => {
  //let database: string[] = [];
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
