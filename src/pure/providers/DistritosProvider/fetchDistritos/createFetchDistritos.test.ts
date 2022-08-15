import { assertEquals } from "@/deps.ts";
import { Result } from "@/pure/kinds/Result.ts";
import { Distritos } from "@/pure/models/Distrito.ts";
import { createFetchDistritos } from "./createFetchDistritos.ts";

Deno.test("createFetchDistritos should fetch distritos", async () => {
  const distritosJsonBody = [{
    "distrito-id": 110020505,
    "distrito-nome": "Porto Velho",
    "municipio-id": 1100205,
    "municipio-nome": "Porto Velho",
    "UF-id": 11,
    "UF-sigla": "RO",
  }];

  const distritos: Distritos = [{
    "distrito-id": "110020505",
    "distrito-nome": "Porto Velho",
    "municipio-id": "1100205",
    "municipio-nome": "Porto Velho",
    "UF-id": "11",
    "UF-sigla": "RO",
  }];

  const fetchDistritos = createFetchDistritos({
    async fetch(input: string): Promise<Response> {
      await Promise.resolve();

      if (
        input !==
          "https://servicodados.ibge.gov.br/api/v1/localidades/distritos?view=nivelado"
      ) {
        throw new Error("It is not fetching from localidades api");
      }

      return Response.json(distritosJsonBody);
    },
  });

  const distritosResult = await fetchDistritos();

  assertEquals(distritosResult, Result.done(distritos));
});
