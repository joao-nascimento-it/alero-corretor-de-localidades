import { Distrito, Distritos } from "@/models/Distrito.ts";

export type QueryAllDistritos = () => Promise<Distritos>;
export type QuerySimilarDistritosByName = (
  name: Distrito["municipio-nome"],
) => Promise<Distritos>;
export type FindOneDistritoByMunicipioId = (
  municipioId: string,
) => Promise<Distrito | undefined>;
