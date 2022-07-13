import { Distritos } from "@/models/Distrito.ts";
import { sortBySimilarString } from "@/shared/sortBySimilarString/index.ts";
import {
  QueryAllDistritos,
  QuerySimilarDistritosByName,
} from "./IDistritosProvider.ts";

export function createQueryAllDistritos(
  distritos: Distritos,
): QueryAllDistritos {
  return async () => {
    return await distritos;
  };
}

export function createQuerySimilarDistritosByName(
  distritos: Distritos,
): QuerySimilarDistritosByName {
  return async (name) => {
    return await sortBySimilarString(
      name,
      distritos,
      (item) => item["distrito-nome"],
    );
  };
}
