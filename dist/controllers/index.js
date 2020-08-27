"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseController = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = require("../models/user");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BaseController {
  sendCreateUpdateErrorResponse(res, error) {
    if (error instanceof _mongoose.default.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res.status(clientErrors.code).send({
        code: clientErrors.code,
        error: clientErrors.error
      });
    } else {
      res.status(500).send({
        code: 500,
        error: "Something went wrong"
      });
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
      code: 422,
      error: error.message
    };
  }

}

exports.BaseController = BaseController;