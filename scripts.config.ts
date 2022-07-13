import { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run main.ts",
      desc: "Start application",
    },
    updatelocalidade: {
      cmd: "deno run src/controllers/updateLocalidade/index.ts",
    },
    parseRaw: {
      cmd: "deno run src/controllers/parseRawLocalidades/index.ts",
    },
    test: {
      cmd: "deno test ./src",
    },
  },
  watch: false,
};

export default config;
