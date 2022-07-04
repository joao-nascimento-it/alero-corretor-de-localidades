import { createFetchDistritos } from "./createFetchDistritos.ts";

export const fetchDistritos = createFetchDistritos({
  fetch: fetch,
});
