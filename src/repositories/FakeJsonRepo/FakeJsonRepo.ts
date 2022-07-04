import { Result } from "../../kinds/Result.ts";
import { IFakeJsonRepo } from "./IFakeJsonRepo.ts";

export class FakeJsonRepo<T> implements IFakeJsonRepo<T> {
  queryFirst(): Promise<Result<T, Error>> {
    throw new Error("Method not implemented.");
  }
  queryAll(): Promise<Result<Iterable<T>, Error>> {
    throw new Error("Method not implemented.");
  }
  deleteFirst(): Promise<Result<T, Error>> {
    throw new Error("Method not implemented.");
  }
  insert(item: T): Promise<Result<T, Error>> {
    throw new Error("Method not implemented.");
  }
}
