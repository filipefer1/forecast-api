"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForecastController = void 0;

var _core = require("@overnightjs/core");

var _forecast = require("../services/forecast");

var _beach = require("../models/beach");

var _auth = require("../middlewares/auth");

var _dec, _dec2, _dec3, _class, _class2;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

const forecast = new _forecast.Forecast();
let ForecastController = (_dec = (0, _core.Controller)("forecast"), _dec2 = (0, _core.ClassMiddleware)(_auth.authMiddleware), _dec3 = (0, _core.Get)(""), _dec(_class = _dec2(_class = (_class2 = class ForecastController {
  async getForecastForLoggedUser(req, res) {
    try {
      var _req$decoded;

      const beaches = await _beach.Beach.find({
        user: (_req$decoded = req.decoded) === null || _req$decoded === void 0 ? void 0 : _req$decoded.id
      });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (err) {
      res.status(500).send({
        error: "Something went wrong"
      });
    }
  }

}, (_applyDecoratedDescriptor(_class2.prototype, "getForecastForLoggedUser", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "getForecastForLoggedUser"), _class2.prototype)), _class2)) || _class) || _class);
exports.ForecastController = ForecastController;