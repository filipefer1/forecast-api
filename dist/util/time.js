"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeUtil = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TimeUtil {
  static getUnixTimeForAFutureDay(days) {
    return (0, _moment.default)().add(days, "days").unix();
  }

}

exports.TimeUtil = TimeUtil;