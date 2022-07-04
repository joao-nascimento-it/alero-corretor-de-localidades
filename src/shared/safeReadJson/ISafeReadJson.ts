import { Result } from "@src/kinds/Result.ts";

export type SafeReadJson = (path: string) => Promise<Result<unknown, Error>>;
