import { safeReadJson } from "@/shared/safeReadJson/index.ts";
import { createFetchIncorrectTable } from "./createFetchIncorrectTable.ts";

export const fetchIncorrectTable = createFetchIncorrectTable({
  safeReadJson,
});
