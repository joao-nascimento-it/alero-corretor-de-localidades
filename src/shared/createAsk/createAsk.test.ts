import { assertEquals } from "@/deps.ts";
import { Result } from "@/kinds/Result.ts";
import { createAsk, CreateAskDeps, RepeatError } from "./createAsk.ts";

Deno.test("createAsk", async () => {
  const state = new State(["What is 2 + 2?"]);

  const ask = createAsk(state);

  const data = await ask("What is 2 + 2?");

  assertEquals(data, Result.done("4"));
});

class State implements CreateAskDeps<string, Error> {
  printOutputs: string[] = [];
  printAskOutputs: string[] = [];
  constructor(public inputs: (string | null)[]) {}

  async print(message: string): Promise<void> {
    await Promise.resolve();
    this.printOutputs.push(message);
  }

  async printAsk(message: string): Promise<string | null> {
    await Promise.resolve();
    this.printAskOutputs.push(message);
    const data = this.inputs.shift();
    if (data === undefined) {
      throw new Error("No input");
    }
    return data;
  }

  async parse(data: string): Promise<Result<string, Error | RepeatError>> {
    await Promise.resolve();
    if (data !== "4") {
      return Result.fail(new RepeatError(""));
    }
    return Result.done(data);
  }
}
