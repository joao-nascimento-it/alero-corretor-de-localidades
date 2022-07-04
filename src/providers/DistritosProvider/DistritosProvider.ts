import { Result } from "../../kinds/Result.ts";
import { Distritos } from "../../models/Distrito.ts";

export function createQueryAllDistritos(distritos: Distritos) {
  return async (): Promise<Distritos> => {
    return await distritos;
  };
}
