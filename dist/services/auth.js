"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuthService {
  static async hashPassword(password, salt = 10) {
    return await _bcrypt.default.hash(password, salt);
  }

  static async comparePasswords(password, hashedPassword) {
    return _bcrypt.default.compare(password, hashedPassword);
  }

  static generateToken(payload) {
    return _jsonwebtoken.default.sign(payload, _config.default.get("App.auth.key"), {
      expiresIn: _config.default.get("App.auth.tokenExpiresIn")
    });
  }

  static decodeToken(token) {
    return _jsonwebtoken.default.verify(token, _config.default.get("App.auth.key"));
  }

}

exports.default = AuthService;