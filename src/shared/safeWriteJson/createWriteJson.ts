import { Result } from "@/kinds/Result.ts";
import { SafeWriteJson } from "./ISafeWriteJson.ts";

interface CreateSafeWriteJsonDeps {
  writeTextFile(path: string | URL, data: string): Promise<void>;
}

export function createSafeWriteJson({
  writeTextFile,
}: CreateSafeWriteJsonDeps): SafeWriteJson<Error> {
  return async (path, data) => {
    try {
      const file = JSON.stringify(data);
      await writeTextFile(path, file);
      return Result.done(undefined);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  };
}
