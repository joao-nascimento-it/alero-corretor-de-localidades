import { assertEquals } from "@/deps.ts";
import {
  createQueryAllDistritos,
  createQuerySimilarDistritosByName,
} from "./createDistritosProvider.ts";

Deno.test("Distrito Provider", async () => {
  const queryAllDistritos = createQueryAllDistritos([{
    "distrito-id": "110020505",
    "distrito-nome": "Porto Velho",
    "municipio-id": "1100205",
    "municipio-nome": "Porto Velho",
    "UF-id": "11",
    "UF-sigla": "RO",
  }]);

  const distritos = await queryAllDistritos();

  assertEquals(distritos, [{
    "distrito-id": "110020505",
    "distrito-nome": "Porto Velho",
    "municipio-id": "1100205",
    "municipio-nome": "Porto Velho",
    "UF-id": "11",
    "UF-sigla": "RO",
  }]);
});

Deno.test("createQuerySimilarDistritosByName", async () => {
  const querySimilarDistritosByName = createQuerySimilarDistritosByName([{
    "distrito-id": "120040105",
    "distrito-nome": "Rio Branco",
    "municipio-id": "1200401",
    "municipio-nome": "Rio Branco",
    "UF-id": "12",
    "UF-sigla": "AC",
  }, {
    "distrito-id": "110020505",
    "distrito-nome": "Porto Velho",
    "municipio-id": "1100205",
    "municipio-nome": "Porto Velho",
    "UF-id": "11",
    "UF-sigla": "RO",
  }]);

  const distritos = await querySimilarDistritosByName("Porto Velho");
  assertEquals(distritos, [{
    "distrito-id": "110020505",
    "distrito-nome": "Porto Velho",
    "municipio-id": "1100205",
    "municipio-nome": "Porto Velho",
    "UF-id": "11",
    "UF-sigla": "RO",
  }, {
    "distrito-id": "120040105",
    "distrito-nome": "Rio Branco",
    "municipio-id": "1200401",
    "municipio-nome": "Rio Branco",
    "UF-id": "12",
    "UF-sigla": "AC",
  }]);
});
