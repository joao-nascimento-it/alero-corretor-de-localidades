import { Result } from "@/kinds/Result.ts";

import {
  DeleteFirstItem,
  InsertItem,
  QueryAllItems,
  QueryFirstItem,
} from "./IJsonRepository.ts";

export function createQueryAllItems<T>(database: T[]): QueryAllItems<T, never> {
  return async () => {
    return await Result.done(database);
  };
}

export function createInsertItem<T>(database: T[]): InsertItem<T, never> {
  return async (item: T) => {
    database.push(item);
    return await Result.done(item);
  };
}

export function createQueryFirstItem<T>(
  database: T[],
): QueryFirstItem<T, never> {
  return async () => {
    await Promise.resolve();
    const head = database[0];
    return Result.done(head);
  };
}

export function createDeleteFirstItem<T>(
  database: T[],
): DeleteFirstItem<T, never> {
  return async () => {
    database.shift();
    return await Result.done(undefined);
  };
}
