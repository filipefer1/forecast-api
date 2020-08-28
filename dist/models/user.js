"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.CUSTOM_VALIDATION = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _auth = _interopRequireDefault(require("../services/auth"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CUSTOM_VALIDATION;
exports.CUSTOM_VALIDATION = CUSTOM_VALIDATION;

(function (CUSTOM_VALIDATION) {
  CUSTOM_VALIDATION["DUPLICATED"] = "DUPLICATED";
})(CUSTOM_VALIDATION || (exports.CUSTOM_VALIDATION = CUSTOM_VALIDATION = {}));

const schema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email must be unique"]
  },
  password: {
    type: String,
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
schema.path("email").validate(async email => {
  const emailCount = await _mongoose.default.models.User.countDocuments({
    email
  });
  return !emailCount;
}, "already exists in the database.", CUSTOM_VALIDATION.DUPLICATED);
schema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  try {
    const hashedPassword = await _auth.default.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (error) {
    _logger.default.error(`Error hashing the password  for the user ${this.name}`);
  }
});

const User = _mongoose.default.model("User", schema);

exports.User = User;