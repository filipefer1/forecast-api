"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Forecast = exports.ForecastProcessingInternalError = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _stormGlass = require("../clients/stormGlass");

var _internalError = require("../util/errors/internalError");

var _logger = _interopRequireDefault(require("../logger"));

var _rating = require("./rating");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ForecastProcessingInternalError extends _internalError.InternalError {
  constructor(message) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }

}

exports.ForecastProcessingInternalError = ForecastProcessingInternalError;

class Forecast {
  constructor(stormGlass = new _stormGlass.StormGlass(), RatingService = _rating.Rating) {
    this.stormGlass = stormGlass;
    this.RatingService = RatingService;
  }

  async processForecastForBeaches(beaches) {
    try {
      const beachForecast = await this.calculateRating(beaches);
      const timeForecast = this.mapForecastByTime(beachForecast);
      return timeForecast.map(t => ({
        time: t.time,
        forecast: _lodash.default.orderBy(t.forecast, ["rating"], ["desc"])
      }));
    } catch (error) {
      _logger.default.error(error);

      throw new ForecastProcessingInternalError(error.message);
    }
  }

  async calculateRating(beaches) {
    const pointsWithCorrectSources = [];

    _logger.default.info(`Preparing the forecast for ${beaches.length} beaches`);

    for (const beach of beaches) {
      const rating = new this.RatingService(beach);
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = this.enrichedBeachData(points, beach, rating);
      pointsWithCorrectSources.push(...enrichedBeachData);
    }

    return pointsWithCorrectSources;
  }

  enrichedBeachData(points, beach, rating) {
    return points.map(point => ({ ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point)
      },
      ...point
    }));
  }

  mapForecastByTime(forecast) {
    const forecastByTime = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find(f => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        });
      }
    }

    return forecastByTime;
  }

}

exports.Forecast = Forecast;