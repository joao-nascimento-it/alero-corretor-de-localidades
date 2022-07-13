import { distance } from "@/deps.ts";

export function sortBySimilarString<T>(
  target: string,
  array: readonly T[],
  fn: (item: T) => string,
): T[] {
  return array
    .map((item) => ({
      item,
      distance: distance(target, fn(item)),
    }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ item }) => item);
}
