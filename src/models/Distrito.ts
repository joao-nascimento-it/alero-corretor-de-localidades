export type Distrito = Readonly<{
  "distrito-id": string;
  "distrito-nome": string;
  "municipio-id": string;
  "municipio-nome": string;
  "UF-id": string;
  "UF-sigla": string;
}>;

export type Distritos = readonly Distrito[];
