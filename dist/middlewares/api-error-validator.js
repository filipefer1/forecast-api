"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiErrorValidator = apiErrorValidator;

var _apiError = _interopRequireDefault(require("../util/errors/api-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function apiErrorValidator(error, _, res, __) {
  const errorCode = error.status || 500;
  res.status(errorCode).send(_apiError.default.format({
    code: errorCode,
    message: error.message
  }));
}