import { SafeReadJson } from "@/shared/safeReadJson/ISafeReadJson.ts";

const createConvertDatabaseToIncorrectLocalidade = ({
  path,
  safeReadJson,
}: {
  path: string;
  safeReadJson: SafeReadJson;
}) =>
  async () => {
    const dataResult = await safeReadJson(path);
    dataResult;
  };

/*
  import { Localidade, Localidades } from "../../model/Model.ts";

async function converterTabela(from: string, to: string) {
  const data = await Deno.readTextFile(`./assets/${from}`);
  const teste = JSON.parse(data) as {
    data: {
      idufnasc: string;
      idmunicipionasc: string;
    }[];
  };
  const novo = teste.data
    .map(({ idmunicipionasc, idufnasc }): Localidade => ({
      municipio: idmunicipionasc,
      estado: idufnasc,
    }))
    .reduce((state: Localidades, item) => {
      const repeated = state.some((innerItem) => {
        return item !== innerItem && innerItem.estado === item.estado &&
          innerItem.municipio === item.municipio;
      });

      return !repeated ? [...state, item] : state;
    }, []);

  await Deno.writeTextFile(
    `./assets/${to}`,
    JSON.stringify(novo),
  );
}

async function perguntar(texto: string) {
  while (true) {
    await Promise.resolve();
    const data = prompt(texto);
    if (data === null) {
      console.log("Por favor, responda novamente");
      continue;
    }
    return data;
  }
}
async function perguntarConfirmacao(texto: string) {
  while (true) {
    await Promise.resolve();
    const confirmacao = prompt(texto + " Responda s/n");
    switch (confirmacao) {
      case "s": {
        return true;
      }
      case "n": {
        return false;
      }
      default: {
        console.log("Por favor, responda s/n");
      }
    }
  }
}
async function perguntarNomeArquivo() {
  while (true) {
    const nome = await perguntar("Qual o nome do JSON?");
    const confirmar = await perguntarConfirmacao(
      `Deseja confirmar o nome ${nome}.json para o a conversão?`,
    );
    if (confirmar) {
      return nome;
    }
  }
}
export async function converterTabelaUsecase() {
  //const nome = await perguntarNomeArquivo();
  await converterTabela("erro.json", "localidades.json");
  console.log("Done!");
}

*/
