import { Result } from "../../kinds/Result.ts";

export async function safeWriteJson<T>(
  path: string,
  data: any,
): Promise<Result<unknown, Error>> {
  try {
    const file = JSON.stringify(data);
    await Deno.writeTextFile(path, file);
    return Result.done(undefined);
  } catch (error) {
    if (error instanceof Error) {
      return Result.fail(error);
    }
    throw error;
  }
}
