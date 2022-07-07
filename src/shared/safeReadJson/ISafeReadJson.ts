import { Result } from "@/kinds/Result.ts";

export type SafeReadJson<E> = (path: string) => Promise<Result<unknown, E>>;
