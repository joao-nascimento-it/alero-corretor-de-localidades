import { createQueryAllDistritos } from "./DistritosProvider.ts";
import { fetchDistritos } from "./fetchDistritos/index.ts";

const databaseResult = await fetchDistritos();

if (databaseResult.isFail()) {
  throw new Error("Falha ao requisitar a lista de Distritos do IBGE");
}

const database = databaseResult.value;

export const queryAllDistritos = createQueryAllDistritos(database);
