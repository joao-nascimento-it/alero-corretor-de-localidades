import { Result } from "/kinds/Result.ts";

export interface IFakeJsonRepo<T> {
  queryFirst(): Promise<Result<T, Error>>;
  queryAll(): Promise<Result<Iterable<T>, Error>>;
  deleteFirst(): Promise<Result<T, Error>>;
  insert(item: T): Promise<Result<T, Error>>;
}
