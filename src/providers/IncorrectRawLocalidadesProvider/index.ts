import { fetchIncorrectRawLocalidades } from "./fetchIncorrectRawLocalidades.ts/index.ts";

const incorrectRawLocalidadesResult = await fetchIncorrectRawLocalidades(
  "./private/erro.json",
);

if (incorrectRawLocalidadesResult.isFail()) {
  throw new Error("Failed to fetchRawIncorrectLocalidade", {
    cause: incorrectRawLocalidadesResult.value,
  });
}

const incorrectRawLocalidades = incorrectRawLocalidadesResult.value;

export const queryAllIncorrectRawLocalidades = async () => {
  await Promise.resolve();
  return incorrectRawLocalidades;
};
