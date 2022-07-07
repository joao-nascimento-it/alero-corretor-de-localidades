import { assertEquals, z } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import {
  createDeleteFirstItem,
  createInsertItem,
  createQueryAllItems,
  createQueryFirstItem,
  JsonRepositoryValidator,
} from "./createJsonRepository.ts";

Deno.test("FakeJsonRepository should query All", async () => {
  const database = new Fake(["Item"]);

  const queryAllItems = createQueryAllItems({
    path: "file.json",
    safeReadJson: Fake.createFakeSafeReadJson(database),
    validate: Fake.createFakeJsonRepositoryValidator(),
  });

  const items = await queryAllItems();

  assertEquals(items, Result.done(["Item"]));
  assertEquals(database.array, ["Item"]);
});

Deno.test("JsonRepository should insert item", async () => {
  const database = new Fake([]);

  const insertItem = createInsertItem({
    path: "file.json",
    safeReadJson: Fake.createFakeSafeReadJson(database),
    safeWriteJson: Fake.createFakeSafeWriteJson(database),
    validate: Fake.createFakeJsonRepositoryValidator(),
  });

  const result = await insertItem("Item");

  assertEquals(result, Result.done("Item"));
  assertEquals(database.array, ["Item"]);
});

Deno.test("JsonRepository should query first item", async () => {
  const database = new Fake(["Item"]);

  const queryFirstItem = createQueryFirstItem({
    path: "file.json",
    safeReadJson: Fake.createFakeSafeReadJson(database),
    validate: Fake.createFakeJsonRepositoryValidator(),
  });

  const itemResult = await queryFirstItem();

  assertEquals(itemResult, Result.done("Item"));
  assertEquals(database.array, ["Item"]);
});

Deno.test("JsonRepository should query first item", async () => {
  const database = new Fake(["Item"]);

  const deleteFirstItem = createDeleteFirstItem({
    path: "file.json",
    safeReadJson: Fake.createFakeSafeReadJson(database),
    safeWriteJson: Fake.createFakeSafeWriteJson(database),
    validate: Fake.createFakeJsonRepositoryValidator(),
  });

  const result = await deleteFirstItem();

  assertEquals(result, Result.done(undefined));
  assertEquals(database.array, []);
});

const testSchema = z.array(z.string());

class Fake<T> {
  constructor(public array: T[]) {
  }

  static createFakeSafeWriteJson = <T>(
    database: Fake<T>,
  ): SafeWriteJson<never> =>
    async (path, data) => {
      await Promise.resolve();
      assertEquals(path, "file.json");
      database.array = data;
      return Result.done(undefined);
    };

  static createFakeSafeReadJson = <T>(
    database: Fake<T>,
  ): SafeReadJson<never> =>
    async (path) => {
      await Promise.resolve();
      assertEquals(path, "file.json");
      return Result.done(database.array);
    };

  static createFakeJsonRepositoryValidator = (): JsonRepositoryValidator<
    string,
    Error
  > =>
    async (data) => {
      const parsedData = await testSchema.safeParseAsync(data);
      if (!parsedData.success) {
        return Result.fail(parsedData.error);
      }
      return Result.done(parsedData.data);
    };
}
