import { createSafeReadJson } from "./createSafeReadJson.ts";

export const safeReadJson = createSafeReadJson({
  readTextFile: Deno.readTextFile,
});
