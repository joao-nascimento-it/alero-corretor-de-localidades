import { createSafeWriteJson } from "@/pure/shared/safeWriteJson/createWriteJson.ts";

export const safeWriteJson = createSafeWriteJson({
  writeTextFile: Deno.writeTextFile,
});
