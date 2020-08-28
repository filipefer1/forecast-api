"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _httpStatusCodes = _interopRequireDefault(require("http-status-codes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ApiError {
  static format(error) {
    return { ...{
        message: error.message,
        code: error.code,
        error: error.codeAsString ? error.codeAsString : _httpStatusCodes.default.getStatusText(error.code)
      },
      ...(error.documentation && {
        documentation: error.documentation
      }),
      ...(error.description && {
        description: error.description
      })
    };
  }

}

exports.default = ApiError;