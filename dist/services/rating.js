"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rating = void 0;

var _beach = require("../models/beach");

const waveHeights = {
  ankleToknee: {
    min: 0.3,
    max: 1.0
  },
  waistHigh: {
    min: 1.0,
    max: 2.0
  },
  headHigh: {
    min: 2.0,
    max: 2.5
  }
};

class Rating {
  constructor(beach) {
    this.beach = beach;
  }

  getRateForPoint(point) {
    const swellDirection = this.getPostionFromLocation(point.swellDirection);
    const windDirection = this.getPostionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(swellDirection, windDirection);
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;
    return Math.round(finalRating);
  }

  getRatingBasedOnWindAndWavePositions(wavePosition, windPosition) {
    if (wavePosition === windPosition) {
      return 1;
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5;
    }

    return 3;
  }

  getRatingForSwellPeriod(period) {
    if (period >= 7 && period < 10) {
      return 2;
    }

    if (period >= 10 && period < 14) {
      return 4;
    }

    if (period >= 14) {
      return 5;
    }

    return 1;
  }

  getRatingForSwellSize(height) {
    if (height >= waveHeights.ankleToknee.min && height < waveHeights.ankleToknee.max) {
      return 2;
    }

    if (height >= waveHeights.waistHigh.min && height < waveHeights.waistHigh.max) {
      return 3;
    }

    if (height >= waveHeights.headHigh.min) {
      return 5;
    }

    return 1;
  }

  getPostionFromLocation(coordinates) {
    if (coordinates >= 310 || coordinates < 50 && coordinates >= 0) {
      return _beach.GeoPosition.N;
    }

    if (coordinates >= 50 && coordinates < 120) {
      return _beach.GeoPosition.E;
    }

    if (coordinates >= 120 && coordinates < 220) {
      return _beach.GeoPosition.S;
    }

    if (coordinates >= 220 && coordinates < 310) {
      return _beach.GeoPosition.W;
    }

    return _beach.GeoPosition.E;
  }

  isWindOffShore(wavePosition, windPosition) {
    return wavePosition === _beach.GeoPosition.N && windPosition === _beach.GeoPosition.S && this.beach.position === _beach.GeoPosition.N || wavePosition === _beach.GeoPosition.S && windPosition === _beach.GeoPosition.N && this.beach.position === _beach.GeoPosition.S || wavePosition === _beach.GeoPosition.E && windPosition === _beach.GeoPosition.W && this.beach.position === _beach.GeoPosition.E || wavePosition === _beach.GeoPosition.W && windPosition === _beach.GeoPosition.E && this.beach.position === _beach.GeoPosition.W;
  }

}

exports.Rating = Rating;