"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Beach = exports.BeachPosition = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let BeachPosition;
exports.BeachPosition = BeachPosition;

(function (BeachPosition) {
  BeachPosition["S"] = "S";
  BeachPosition["E"] = "E";
  BeachPosition["W"] = "W";
  BeachPosition["N"] = "N";
})(BeachPosition || (exports.BeachPosition = BeachPosition = {}));

const schema = new _mongoose.default.Schema({
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  user: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

const Beach = _mongoose.default.model("Beach", schema);

exports.Beach = Beach;