import {
  createQueryAllDistritos,
  createQuerySimilarDistritosByName,
} from "./createDistritosProvider.ts";
import { fetchDistritos } from "./fetchDistritos/index.ts";

const databaseResult = await fetchDistritos();

if (databaseResult.isFail()) {
  throw new Error("Falha ao requisitar a lista de Distritos do IBGE");
}

const database = databaseResult.value;

export const queryAllDistritos = createQueryAllDistritos(database);

export async function findOneDistritoByMunicipioId(id: string) {
  const distritos = await queryAllDistritos();
  return distritos.find((distrito) => {
    return distrito["municipio-id"] === id;
  });
}

export const querySimilarDistritosByName = createQuerySimilarDistritosByName(
  database,
);
