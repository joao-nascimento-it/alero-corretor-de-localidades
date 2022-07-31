export type Localidade = Readonly<{
  municipio: string;
  estado: string;
}>;

export type Localidades = ReadonlyArray<Localidade>;
