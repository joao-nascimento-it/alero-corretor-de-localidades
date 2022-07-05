import { Result } from "../../kinds/Result.ts";

import { z } from "@src/deps.ts";
import {
  InsertItem,
  QueryAllItems,
  QueryFirstItem,
} from "./IJsonRepository.ts";
import { SafeReadJson } from "@src/shared/safeReadJson/ISafeReadJson.ts";
import { SafeWriteJson } from "../../shared/safeWriteJson/ISafeWriteJson.ts";

type CreateQueryAllItemsDeps = Readonly<{
  path: string;
  safeReadJson: SafeReadJson;
}>;

const arraySchema = z.array(z.unknown());

export const createQueryAllItems = <T>({
  path,
  safeReadJson,
}: CreateQueryAllItemsDeps): QueryAllItems<T> =>
  async () => {
    const data = await safeReadJson(path);
    if (data.isFail()) {
      return data;
    }
    const dataResult = await arraySchema.safeParseAsync(data.value);

    if (!dataResult.success) {
      return Result.fail(dataResult.error);
    }

    return Result.done(dataResult.data as T[]);
  };

interface CreateInsertItemDeps {
  readonly path: string;
  safeReadJson: SafeReadJson;
  safeWriteJson: SafeWriteJson;
}

export const createInsertItem = <T>({
  path,
  safeReadJson,
  safeWriteJson,
}: CreateInsertItemDeps): InsertItem<T> =>
  async (item) => {
    const data = await safeReadJson(path);
    if (data.isFail()) return data;

    const dataResult = await arraySchema.safeParseAsync(data.value);

    if (!dataResult.success) {
      return Result.fail(dataResult.error);
    }

    const database = dataResult.data;

    const result = await safeWriteJson(path, [item, ...database]);
    if (result.isFail()) return result;

    return Result.done(item);
  };

interface CreateQueryFirstItemDeps<T> {
  path: string;
  safeReadJson: SafeReadJson;
}
export const createQueryFirstItem = <T>(
  { path, safeReadJson }: CreateQueryFirstItemDeps<T>,
): QueryFirstItem<T> =>
  async () => {
    const queryAllItems = createQueryAllItems<T>({ path, safeReadJson });

    const itemsResult = await queryAllItems();
    if (itemsResult.isFail()) return itemsResult;

    const [head] = itemsResult.value;

    if (!head) {
      return Result.fail(undefined);
    }

    return Result.done(head);
  };
