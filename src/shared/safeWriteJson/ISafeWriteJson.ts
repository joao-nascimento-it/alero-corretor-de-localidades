import { Result } from "@/kinds/Result.ts";

export type SafeWriteJson = (
  path: string,
  data: any,
) => Promise<Result<undefined, Error>>;
