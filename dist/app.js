"use strict";

var _server = require("./server");

var _config = _interopRequireDefault(require("config"));

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExitStatus;

(function (ExitStatus) {
  ExitStatus[ExitStatus["Failure"] = 1] = "Failure";
  ExitStatus[ExitStatus["Success"] = 0] = "Success";
})(ExitStatus || (ExitStatus = {}));

process.on("unhandledRejection", (reason, promise) => {
  _logger.default.error(`App exiting due to an unhandled promise: ${promise} and reason: ${reason}`);

  throw reason;
});
process.on("uncaughtException", error => {
  _logger.default.error(`App exiting due to an uncaught error: ${error}`);

  process.exit(ExitStatus.Failure);
});

(async () => {
  try {
    const server = new _server.SetupServer(_config.default.get("App.port"));
    await server.init();
    server.start();
    const exitSignals = ["SIGINT", "SIGTERM", "SIGQUIT"];

    for (const sig of exitSignals) {
      process.on(sig, async () => {
        try {
          await server.close();

          _logger.default.info(`App exited with success`);

          process.exit(ExitStatus.Success);
        } catch (error) {
          _logger.default.error(`App exited with error: ${error}`);

          process.exit(ExitStatus.Failure);
        }
      });
    }
  } catch (error) {
    _logger.default.error(`App exited with error: ${error}`);

    process.exit(ExitStatus.Failure);
  }
})();