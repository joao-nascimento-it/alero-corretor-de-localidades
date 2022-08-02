import { z } from "@/deps.ts";
import { Result } from "@/pure/kinds/Result.ts";
import { Distrito, Distritos } from "@/pure/models/Distrito.ts";

const DistritosJsonResponseSchema = z.array(z.object({
  "distrito-id": z.number(),
  "distrito-nome": z.string(),
  "municipio-id": z.string(),
  "municipio-nome": z.string(),
  "UF-id": z.number(),
  "UF-sigla": z.string(),
}));

interface FetchDistritosDeps {
  fetch(
    input: string | Request,
    init?: RequestInit | undefined,
  ): Promise<Response>;
}

export function createFetchDistritos({ fetch }: FetchDistritosDeps) {
  return async function fetchDistritos(): Promise<Result<Distritos, Error>> {
    try {
      const response = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/distritos?view=nivelado",
      );

      const body = await response.json();

      const distritosResult = await DistritosJsonResponseSchema.safeParseAsync(
        body,
      );

      if (!distritosResult.success) {
        return Result.fail(distritosResult.error);
      }

      const mapped = distritosResult.data.map((item): Distrito => ({
        "distrito-id": item["distrito-id"].toFixed(),
        "distrito-nome": item["distrito-nome"],
        "municipio-id": item["municipio-id"],
        "municipio-nome": item["municipio-nome"],
        "UF-id": item["UF-id"].toFixed(),
        "UF-sigla": item["UF-sigla"],
      }));

      return Result.done(mapped);
    } catch (error) {
      if (error instanceof Error) {
        return Result.fail(error);
      }
      throw error;
    }
  };
}
