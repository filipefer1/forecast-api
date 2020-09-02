"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseController = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = require("../models/user");

var _logger = _interopRequireDefault(require("../logger"));

var _apiError = _interopRequireDefault(require("../util/errors/api-error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BaseController {
  sendCreateUpdateErrorResponse(res, error) {
    if (error instanceof _mongoose.default.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res.status(clientErrors.code).send(_apiError.default.format({
        code: clientErrors.code,
        message: clientErrors.error
      }));
    } else {
      _logger.default.error(error);

      res.status(500).send(_apiError.default.format({
        code: 500,
        message: "Something went wrong"
      }));
    }
  }

  handleClientErrors(error) {
    const duplicatedKindErros = Object.values(error.errors).filter(err => err.kind === _user.CUSTOM_VALIDATION.DUPLICATED);

    if (duplicatedKindErros.length) {
      return {
        code: 409,
        error: error.message
      };
    }

    return {
      code: 400,
      error: error.message
    };
  }

  sendErrorResponse(res, apiError) {
    return res.status(apiError.code).send(_apiError.default.format(apiError));
  }

}

exports.BaseController = BaseController;