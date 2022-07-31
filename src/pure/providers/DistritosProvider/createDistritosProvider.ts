import { Distritos } from "@/pure/models/Distrito.ts";
import { sortBySimilarString } from "@/pure/utils/sortBySimilarString/index.ts";
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

export const filterSimilarDistritosByName = (
  target: string,
  distritos: Distritos,
) => {
  return sortBySimilarString(
    target,
    distritos,
    (item) => item["distrito-nome"],
  );
};
