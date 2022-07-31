import { createSafeReadJson } from "@/pure/shared/safeReadJson/createSafeReadJson.ts";

export const safeReadJson = createSafeReadJson({
  readTextFile: Deno.readTextFile,
});
