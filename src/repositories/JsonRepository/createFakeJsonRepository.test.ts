import { assertEquals, assertObjectMatch } from "@src/deps.ts";
import { Result } from "../../kinds/Result.ts";

import {
  createDeleteFirstItem,
  createInsertItem,
  createQueryAllItems,
  createQueryFirstItem,
} from "./createFakeJsonRepository.ts";

Deno.test("FakeJsonRepository should query All", async () => {
  const queryAllItems = createQueryAllItems(["Item"]);

  const items = await queryAllItems();

  assertObjectMatch({
    items,
  }, {
    items: Result.done(["Item"]),
  });
});

Deno.test("FakeJsonRepository should insert", async () => {
  const database = ["Hello"];
  const insertItem = createInsertItem(database);

  const item = await insertItem("World");

  assertObjectMatch({
    item,
  }, {
    item: Result.done("World"),
  });

  assertObjectMatch({
    database,
  }, { database: ["Hello", "World"] });
});

Deno.test("FakeJsonRepository should queryFirstItem", async () => {
  const queryFirstItem = createQueryFirstItem(["Hello"]);

  const item = await queryFirstItem();

  assertObjectMatch({
    item,
  }, {
    item: Result.done("Hello"),
  });
});

Deno.test("FakeJsonRepository should delete item", async () => {
  const database = ["Hello"];
  const deleteFirstItem = createDeleteFirstItem(database);

  const result = await deleteFirstItem();

  assertObjectMatch({
    result,
  }, {
    result: Result.done(undefined),
  });
  assertObjectMatch({
    database,
  }, {
    database: [],
  });
});
