import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import { Localidade } from "@/models/Localidade.ts";
import {
  createQueryAllLocalidades,
  createQueryFirstLocalidade,
} from "./createLocalidadeRepository.ts";

Deno.test("createQueryAllIncorretaLocalidades", async (t) => {
  await t.step("Should query all", async () => {
    const database = new Fake<Localidade>([{
      municipio: "municipio",
      estado: "estado",
    }]);

    const queryAllItems = createQueryAllLocalidades({
      path: "file.json",
      safeReadJson: Fake.createFakeSafeReadJson(database),
    });

    const items = await queryAllItems();

    assertEquals(
      items,
      Result.done([{
        municipio: "municipio",
        estado: "estado",
      }]),
    );
    assertEquals(database.array, [{
      municipio: "municipio",
      estado: "estado",
    }]);
  });

  await t.step("Should query first", async () => {
    const database = new Fake<Localidade>([{
      municipio: "municipio",
      estado: "estado",
    }]);

    const queryFirstItem = createQueryFirstLocalidade({
      path: "file.json",
      safeReadJson: Fake.createFakeSafeReadJson(database),
    });

    const itemResult = await queryFirstItem();

    assertEquals(
      itemResult,
      Result.done({
        municipio: "municipio",
        estado: "estado",
      }),
    );
    assertEquals(database.array, [{
      municipio: "municipio",
      estado: "estado",
    }]);
  });
});

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
}
