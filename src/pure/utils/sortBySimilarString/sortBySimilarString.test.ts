import { assertEquals } from "@/deps.ts";
import { sortBySimilarString } from "./index.ts";

Deno.test("sortBySimilarString", async (t) => {
  await t.step("Should sort strings", () => {
    const sorted = sortBySimilarString(
      "Hello",
      ["Hell", "Hello"],
      (item) => item,
    );
    assertEquals(sorted, ["Hello", "Hell"]);
  });
});
