import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "@/shared/safeWriteJson/ISafeWriteJson.ts";
import {
  DeleteFirstItem,
  InsertItem,
  QueryAllItems,
  QueryFirstItem,
} from "./IJsonRepository.ts";

export type JsonRepositoryValidator<T> = (
  item: unknown,
) => Promise<Result<readonly T[], Error>>;

type CreateQueryAllItemsDeps<T> = Readonly<{
  path: string;
  safeReadJson: SafeReadJson;
  validate: JsonRepositoryValidator<T>;
}>;

export const createQueryAllItems = <T>({
  path,
  safeReadJson,
  validate,
}: CreateQueryAllItemsDeps<T>): QueryAllItems<T> =>
  async () => {
    const data = await safeReadJson(path);

    if (data.isFail()) return data;

    const validatorResult = await validate(data.value);

    if (validatorResult.isFail()) return validatorResult;

    return Result.done(validatorResult.value);
  };

interface CreateInsertItemDeps<T> {
  readonly path: string;
  safeReadJson: SafeReadJson;
  safeWriteJson: SafeWriteJson;
  validate: JsonRepositoryValidator<T>;
}

export const createInsertItem = <T>({
  path,
  safeReadJson,
  safeWriteJson,
  validate,
}: CreateInsertItemDeps<T>): InsertItem<T> =>
  async (item) => {
    const data = await safeReadJson(path);
    if (data.isFail()) return data;

    const validatedResult = await validate(data.value);

    if (validatedResult.isFail()) {
      return validatedResult;
    }

    const database = validatedResult.value;

    const result = await safeWriteJson(path, [item, ...database]);
    if (result.isFail()) return result;

    return Result.done(item);
  };

interface CreateQueryFirstItemDeps<T> {
  path: string;
  safeReadJson: SafeReadJson;
  validate: JsonRepositoryValidator<T>;
}

export const createQueryFirstItem = <T>({
  path,
  safeReadJson,
  validate,
}: CreateQueryFirstItemDeps<T>): QueryFirstItem<T> =>
  async () => {
    const queryAllItems = createQueryAllItems<T>({
      path,
      safeReadJson,
      validate,
    });

    const itemsResult = await queryAllItems();
    if (itemsResult.isFail()) return itemsResult;

    const [head] = itemsResult.value;

    if (!head) {
      return Result.fail(undefined);
    }

    return Result.done(head);
  };

interface CreateDeleteFirstItemDeps<T> {
  path: string;
  safeReadJson: SafeReadJson;
  safeWriteJson: SafeWriteJson;
  validate: JsonRepositoryValidator<T>;
}

export const createDeleteFirstItem = <T>({
  path,
  safeReadJson,
  safeWriteJson,
  validate,
}: CreateDeleteFirstItemDeps<T>): DeleteFirstItem<T> =>
  async () => {
    const queryAllItems = createQueryAllItems({ path, safeReadJson, validate });

    const itemsResult = await queryAllItems();
    if (itemsResult.isFail()) return itemsResult;

    const [head, ...tail] = itemsResult.value;

    const result = await safeWriteJson(path, tail);
    if (result.isFail()) return result;

    return Result.done(undefined);
  };
