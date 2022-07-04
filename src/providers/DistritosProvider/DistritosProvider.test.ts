import { assertEquals, assertObjectMatch } from "@deps/asserts.ts";
import { createQueryAllDistritos } from "./DistritosProvider.ts";

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

  assertObjectMatch({
    distritos,
  }, {
    distritos: [{
      "distrito-id": "110020505",
      "distrito-nome": "Porto Velho",
      "municipio-id": "1100205",
      "municipio-nome": "Porto Velho",
      "UF-id": "11",
      "UF-sigla": "RO",
    }],
  });
});
