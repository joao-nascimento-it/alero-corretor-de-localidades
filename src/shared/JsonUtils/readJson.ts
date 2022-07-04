import { Result } from "../../kinds/Result.ts";

export async function safeReadJson<T>(
  path: string,
): Promise<Result<unknown, Error>> {
  try {
    const file = await Deno.readTextFile(path);
    const data = JSON.parse(file);
    return Result.done(data);
  } catch (error) {
    if (error instanceof Error) {
      return Result.fail(error);
    }
    throw error;
  }
}
