"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pino = _interopRequireDefault(require("pino"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _pino.default)({
  enabled: _config.default.get("App.logger.enabled"),
  level: _config.default.get("App.logger.level")
});

exports.default = _default;