import { Result } from "../../kinds/Result.ts";

import {
  DeleteFirstItem,
  InsertItem,
  QueryAllItems,
  QueryFirstItem,
} from "./IJsonRepository.ts";

class FakeJsonRepository<T> {
  constructor(readonly database: T[]) {
  }
}

export function createQueryAllItems<T>(database: T[]): QueryAllItems<T> {
  return async () => {
    return await Result.done(database);
  };
}

export function createInsertItem<T>(database: T[]): InsertItem<T> {
  return async (item: T) => {
    database.push(item);
    return await Result.done(item);
  };
}

export function createQueryFirstItem<T>(database: T[]): QueryFirstItem<T> {
  return async () => {
    await Promise.resolve();
    const head = database[0];
    return head ? Result.done(head) : Result.fail(undefined);
  };
}

export function createDeleteFirstItem<T>(database: T[]): DeleteFirstItem<T> {
  return async () => {
    database.shift();
    return await Result.done(undefined);
  };
}
