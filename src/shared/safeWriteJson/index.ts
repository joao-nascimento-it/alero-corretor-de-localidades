import { createSafeWriteJson } from "./createWriteJson.ts";

export const safeWriteJson = createSafeWriteJson({
  writeTextFile: Deno.writeTextFile,
});
