"use strict";

var _server = require("./server");

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async () => {
  const server = new _server.SetupServer(_config.default.get("App.port"));
  await server.init();
  server.start();
})();