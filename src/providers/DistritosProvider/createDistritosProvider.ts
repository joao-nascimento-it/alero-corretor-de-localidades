import { Distritos } from "../../models/Distrito.ts";
import { QueryAllDistritos } from "./IDistritosProvider.ts";

export function createQueryAllDistritos(
  distritos: Distritos,
): QueryAllDistritos {
  return async () => {
    return await distritos;
  };
}
