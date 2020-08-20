import { SetupServer } from "@src/server";
import config from "config";

(async () => {
  const server = new SetupServer(config.get("App.port"));
  await server.init();
  server.start();
})();
