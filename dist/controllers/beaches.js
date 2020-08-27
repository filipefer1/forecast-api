"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BeachesController = void 0;

var _core = require("@overnightjs/core");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _beach = require("../models/beach");

var _auth = require("../middlewares/auth");

var _dec, _dec2, _dec3, _class, _class2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let BeachesController = (_dec = (0, _core.Controller)("beaches"), _dec2 = (0, _core.ClassMiddleware)(_auth.authMiddleware), _dec3 = (0, _core.Post)(""), _dec(_class = _dec2(_class = (_class2 = class BeachesController {
  async create(req, res) {
    try {
      var _req$decoded;

      const beach = new _beach.Beach({ ...req.body,
        ...{
          user: (_req$decoded = req.decoded) === null || _req$decoded === void 0 ? void 0 : _req$decoded.id
        }
      });
      const result = await beach.save();
      res.status(201).send(result);
    } catch (err) {
      if (err instanceof _mongoose.default.Error.ValidationError) {
        res.status(422).send({
          error: err.message
        });
      } else {
        res.status(500).send({
          error: "Internal Error"
        });
      }
    }
  }

}, (_applyDecoratedDescriptor(_class2.prototype, "create", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "create"), _class2.prototype)), _class2)) || _class) || _class);
exports.BeachesController = BeachesController;