import { Result } from "@/kinds/Result.ts";
import { SafeReadJson } from "./ISafeReadJson.ts";

interface CreateSafeReadJsonDeps {
  readTextFile(path: string | URL): Promise<string>;
}

export function createSafeReadJson(
  { readTextFile }: CreateSafeReadJsonDeps,
): SafeReadJson {
  return async (path) => {
    try {
      const file = await readTextFile(path);
      const data = JSON.parse(file);
      return Result.done(data);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  };
}
