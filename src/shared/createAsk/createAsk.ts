import { Result } from "@/kinds/Result.ts";

export class RepeatError extends Error {
}

export interface CreateAskDeps<T, E> {
  print(message: string): Promise<void>;
  printAsk(message: string): Promise<string | null>;
  parse(data: string): Promise<Result<T, E | RepeatError>>;
}

export const createAsk = <T, E>({
  print,
  printAsk,
  parse,
}: CreateAskDeps<T, E>) =>
  async (message: string): Promise<Result<T, E>> => {
    while (true) {
      const data = await printAsk(message);
      const refined = await parse(data ?? "");

      if (refined.isFail()) {
        const reason = refined.value;
        if (reason instanceof RepeatError) {
          await print(reason.message);
          continue;
        }
        return Result.fail(reason);
      }

      return Result.done(refined.value);
    }
  };
