import { Print } from "./IPrint.ts";

export const print: Print = async (message) => {
  await Promise.resolve();
  console.log(message);
};
