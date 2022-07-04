import { Result } from "../../kinds/Result.ts";

import { z } from "@src/deps.ts";
import { QueryAllItems } from "./IJsonRepository.ts";
import { SafeReadJson } from "@src/shared/safeReadJson/ISafeReadJson.ts";

type CreateQueryAllItemsDeps = Readonly<{
  path: string;
  safeReadJson: SafeReadJson;
}>;

const arraySchema = z.array(z.unknown());

export function createQueryAllItems<T>(
  { path, safeReadJson }: CreateQueryAllItemsDeps,
): QueryAllItems<T> {
  return async () => {
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
}
