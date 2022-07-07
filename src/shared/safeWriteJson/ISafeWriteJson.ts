import { Result } from "@/kinds/Result.ts";

export type SafeWriteJson<E> = (
  path: string,
  data: any,
) => Promise<Result<void, E>>;
