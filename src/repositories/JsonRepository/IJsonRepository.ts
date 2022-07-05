import { Result } from "@/kinds/Result.ts";

export type QueryAllItems<T> = () => Promise<Result<readonly T[], Error>>;
export type InsertItem<T> = (item: T) => Promise<Result<T, Error>>;
export type QueryFirstItem<T> = () => Promise<Result<T, undefined | Error>>;
export type DeleteFirstItem = () => Promise<Result<void, Error>>;
