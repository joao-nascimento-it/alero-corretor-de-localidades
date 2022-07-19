import { Localidade } from "./Localidade.ts";

export type CorrectLocalidade = Readonly<{
  old: Localidade;
  updated: Localidade;
}>;

export type CorrectLocalidades = ReadonlyArray<Localidade>;
