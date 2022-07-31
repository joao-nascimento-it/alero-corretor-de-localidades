import { createFetchDistritos } from "@/pure/providers/DistritosProvider/fetchDistritos/createFetchDistritos.ts";

export const fetchDistritos = createFetchDistritos({
  fetch: fetch,
});
