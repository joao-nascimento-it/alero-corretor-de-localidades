import { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run main.ts",
      desc: "Start application",
    },

    test: {
      cmd: "deno test ./src",
    },
  },
  watch: false,
};

export default config;
