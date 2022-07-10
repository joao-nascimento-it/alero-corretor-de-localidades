import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import {
  DeleteFirstItem,
  InsertItem,
  QueryAllItems,
  QueryFirstItem,
} from "./IJsonRepository.ts";

export type JsonRepositoryValidator<T, E> = (
  item: unknown,
) => Promise<Result<readonly T[], E>>;

type CreateQueryAllItemsDeps<T, E> = Readonly<{
  path: string;
  safeReadJson: SafeReadJson<E>;
  validate: JsonRepositoryValidator<T, E>;
}>;

export const createQueryAllItems = <T, E>({
  path,
  safeReadJson,
  validate,
}: CreateQueryAllItemsDeps<T, E>): QueryAllItems<T, E> =>
  async (): Promise<Result<readonly T[], E>> => {
    const data = await safeReadJson(path);

    if (data.isFail()) {
      return Result.fail(data.value);
    }

    const validatorResult = await validate(data.value);

    if (validatorResult.isFail()) return validatorResult;

    return Result.done(validatorResult.value);
  };

interface CreateInsertItemDeps<T, E> {
  readonly path: string;
  safeReadJson: SafeReadJson<E>;
  safeWriteJson: SafeWriteJson<E>;
  validate: JsonRepositoryValidator<T, E>;
}

export const createInsertItem = <T, E>({
  path,
  safeReadJson,
  safeWriteJson,
  validate,
}: CreateInsertItemDeps<T, E>): InsertItem<T, E> =>
  async (item) => {
    const data = await safeReadJson(path);
    if (data.isFail()) {
      return Result.fail(data.value);
    }

    const validatedResult = await validate(data.value);

    if (validatedResult.isFail()) {
      return validatedResult;
    }

    const database = validatedResult.value;

    const result = await safeWriteJson(path, [item, ...database]);
    if (result.isFail()) {
      return Result.fail(result.value);
    }

    return Result.done(item);
  };

interface CreateQueryFirstItemDeps<T, E> {
  path: string;
  safeReadJson: SafeReadJson<E>;
  validate: JsonRepositoryValidator<T, E>;
}

export const createQueryFirstItem = <T, E>({
  path,
  safeReadJson,
  validate,
}: CreateQueryFirstItemDeps<T, E>): QueryFirstItem<T, E> =>
  async () => {
    const queryAllItems = createQueryAllItems<T, E>({
      path,
      safeReadJson,
      validate,
    });

    const itemsResult = await queryAllItems();
    if (itemsResult.isFail()) return itemsResult;

    const [head] = itemsResult.value;

    return Result.done(head);
  };

interface CreateDeleteFirstItemDeps<T, E> {
  path: string;
  safeReadJson: SafeReadJson<E>;
  safeWriteJson: SafeWriteJson<E>;
  validate: JsonRepositoryValidator<T, E>;
}

export const createDeleteFirstItem = <T, E>({
  path,
  safeReadJson,
  safeWriteJson,
  validate,
}: CreateDeleteFirstItemDeps<T, E>): DeleteFirstItem<T, E> =>
  async () => {
    const queryAllItems = createQueryAllItems({ path, safeReadJson, validate });

    const itemsResult = await queryAllItems();
    if (itemsResult.isFail()) return itemsResult;

    const [head, ...tail] = itemsResult.value;

    const result = await safeWriteJson(path, tail);
    if (result.isFail()) return result;

    return Result.done(head);
  };
