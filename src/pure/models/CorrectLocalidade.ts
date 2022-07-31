import { Localidade } from "./Localidade.ts";

export type CorrectLocalidade = Readonly<{
  incorrect: Localidade;
  correct: Localidade;
}>;

export type CorrectLocalidades = ReadonlyArray<CorrectLocalidade>;
