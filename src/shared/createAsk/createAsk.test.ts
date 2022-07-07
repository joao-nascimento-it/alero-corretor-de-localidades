import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { createAsk, CreateAskDeps, RepeatError } from "./createAsk.ts";

Deno.test("createAsk", async () => {
  const state = new State(["4"]);

  const ask = createAsk(state);

  const data = await ask("What is 2 + 2?");

  assertEquals(data, Result.done("4"));
});

class State implements CreateAskDeps<string, Error> {
  printOutputs: string[] = [];
  printAskOutputs: string[] = [];
  constructor(public inputs: (string | null)[]) {}

  print = async (message: string): Promise<void> => {
    await Promise.resolve();
    this.printOutputs.push(message);
  };

  printAsk = async (message: string): Promise<string | null> => {
    await Promise.resolve();
    this.printAskOutputs.push(message);
    const data = this.inputs.shift();
    if (data === undefined) {
      throw new Error("No input");
    }
    return data;
  };

  parse = async (
    data: string,
  ): Promise<Result<string, RepeatError>> => {
    await Promise.resolve();
    if (data !== "4") {
      return Result.fail(new RepeatError(""));
    }
    return Result.done(data);
  };
}
