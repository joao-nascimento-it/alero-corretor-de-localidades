import { Result } from "./Result.ts";
import { assertEquals, assertStrictEquals } from "std/testing/asserts.ts";

Deno.test("Result", () => {
  const doneResult = Result.done("Some success");

  assertStrictEquals(doneResult.value, "Some success");
});

Deno.test("Result", () => {
  const doneResult = Result.done("Some success");

  assertStrictEquals(doneResult.isDone(), true);
});

Deno.test("Result", () => {
  const doneResult = Result.done("Some success");

  assertStrictEquals(doneResult.isFail(), false);
});

Deno.test("Result", () => {
  const failResult = Result.fail("Some failure");

  assertStrictEquals(failResult.value, "Some failure");
});

Deno.test("Result", () => {
  const failResult = Result.fail("Some failure");

  assertStrictEquals(failResult.isDone(), false);
});

Deno.test("Result", () => {
  const failResult = Result.fail("Some failure");

  assertStrictEquals(failResult.isFail(), true);
});
