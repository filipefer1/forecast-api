"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StormGlass = exports.StormGlassResponseError = exports.ClientRequestError = void 0;

var _config = _interopRequireDefault(require("config"));

var HTTPUtil = _interopRequireWildcard(require("../util/request"));

var _internalError = require("../util/errors/internalError");

var _time = require("../util/time");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ClientRequestError extends _internalError.InternalError {
  constructor(message) {
    const internalMessage = "Unexpected error when trying to communicate to StormGlass";
    super(`${internalMessage}: ${message}`);
  }

}

exports.ClientRequestError = ClientRequestError;

class StormGlassResponseError extends _internalError.InternalError {
  constructor(message) {
    const internalMessage = "Unexpected error returned by the StormGlass service";
    super(`${internalMessage}: ${message}`);
  }

}

exports.StormGlassResponseError = StormGlassResponseError;

const stormGlassResourceConfig = _config.default.get("App.resources.StormGlass");

class StormGlass {
  stormGlassAPIParams = "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed";
  stormGlassAPISource = "noaa";

  constructor(request = new HTTPUtil.Request()) {
    this.request = request;
  }

  async fetchPoints(lat, lng) {
    const endTimestamp = _time.TimeUtil.getUnixTimeForAFutureDay(1);

    try {
      const response = await this.request.get(`${stormGlassResourceConfig.get("apiUrl")}/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}&end=${endTimestamp}`, {
        headers: {
          Authorization: stormGlassResourceConfig.get("apiToken")
        }
      });
      return this.normalizeResponse(response.data);
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new StormGlassResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`);
      }

      throw new ClientRequestError(err.message);
    }
  }

  normalizeResponse(points) {
    return points.hours.filter(this.isValidPoint.bind(this)).map(point => {
      return {
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellHeight[this.stormGlassAPISource],
        swellPeriod: point.swellPeriod[this.stormGlassAPISource],
        time: point.time,
        waveDirection: point.waveDirection[this.stormGlassAPISource],
        waveHeight: point.waveHeight[this.stormGlassAPISource],
        windDirection: point.windDirection[this.stormGlassAPISource],
        windSpeed: point.windSpeed[this.stormGlassAPISource]
      };
    });
  }

  isValidPoint(point) {
    var _point$swellDirection, _point$swellHeight, _point$swellPeriod, _point$waveDirection, _point$waveHeight, _point$windDirection, _point$windSpeed;

    return !!(point.time && ((_point$swellDirection = point.swellDirection) === null || _point$swellDirection === void 0 ? void 0 : _point$swellDirection[this.stormGlassAPISource]) && ((_point$swellHeight = point.swellHeight) === null || _point$swellHeight === void 0 ? void 0 : _point$swellHeight[this.stormGlassAPISource]) && ((_point$swellPeriod = point.swellPeriod) === null || _point$swellPeriod === void 0 ? void 0 : _point$swellPeriod[this.stormGlassAPISource]) && ((_point$waveDirection = point.waveDirection) === null || _point$waveDirection === void 0 ? void 0 : _point$waveDirection[this.stormGlassAPISource]) && ((_point$waveHeight = point.waveHeight) === null || _point$waveHeight === void 0 ? void 0 : _point$waveHeight[this.stormGlassAPISource]) && ((_point$windDirection = point.windDirection) === null || _point$windDirection === void 0 ? void 0 : _point$windDirection[this.stormGlassAPISource]) && ((_point$windSpeed = point.windSpeed) === null || _point$windSpeed === void 0 ? void 0 : _point$windSpeed[this.stormGlassAPISource]));
  }

}

exports.StormGlass = StormGlass;