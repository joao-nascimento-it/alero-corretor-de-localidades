import { Result } from "@/pure/kinds/Result.ts";

export type SafeReadJson<E> = (path: string) => Promise<Result<unknown, E>>;
