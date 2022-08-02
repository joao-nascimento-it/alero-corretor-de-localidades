import { Result } from "@/pure/kinds/Result.ts";

export type QueryAllItems<T, E> = () => Promise<Result<readonly T[], E>>;
export type InsertItem<T, E> = (item: T) => Promise<Result<T, E>>;
export type QueryFirstItem<T, E> = () => Promise<Result<T | undefined, E>>;
export type DeleteFirstItem<T, E> = () => Promise<Result<T | undefined, E>>;
