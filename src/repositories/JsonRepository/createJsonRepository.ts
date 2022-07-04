import { Result } from "../../kinds/Result.ts";
import { safeReadJson } from "@src/shared/JsonUtils/readJson.ts";

import { z } from "@src/deps.ts";
import { QueryAllItems } from "./IJsonRepository.ts";

type FakeJsonDeps = Readonly<{
  path: string;
}>;

const arraySchema = z.array(z.unknown());

export function createQueryAllItems<T>(
  { path }: FakeJsonDeps,
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
