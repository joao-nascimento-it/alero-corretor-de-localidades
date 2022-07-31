import { Print } from "@/pure/shared/print/IPrint.ts";

export const print: Print = async (message) => {
  await Promise.resolve();
  console.log(message);
};
