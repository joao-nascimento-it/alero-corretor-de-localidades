import { Result } from "../../kinds/Result.ts";

import { z } from "@src/deps.ts";
import { QueryAllItems } from "./IJsonRepository.ts";
import { SafeReadJson } from "@src/shared/JsonUtils/safeReadJson/ISafeReadJson.ts";

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
    const dataResult = await arraySchema.safeParseAsync(data);

    if (!dataResult.success) {
      return Result.fail(dataResult.error);
    }

    return Result.done(dataResult.data as T[]);
  };
}
