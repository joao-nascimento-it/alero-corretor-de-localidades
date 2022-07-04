import { assertEquals, assertStrictEquals } from "@deps/asserts.ts";
import { Result } from "./Result.ts";

Deno.test("Result", () => {
  const doneResult = Result.done("Some success");

  assertStrictEquals(doneResult.value, "Some success");
});

Deno.test("Result", () => {
  const result = Result.done("Success");

  assertStrictEquals(result.isDone(), true);
  assertStrictEquals(result.isFail(), false);
  assertStrictEquals(result.value, "Success");
});

Deno.test("Result", () => {
  const result = Result.fail("Failure");

  assertStrictEquals(result.isDone(), false);
  assertStrictEquals(result.isFail(), true);
  assertStrictEquals(result.value, "Failure");
});
